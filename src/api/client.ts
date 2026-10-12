import { ApiError } from './errors'
import { clearSession, emitSessionEvent, getAccessToken, getCurrentRole, setCurrentRole, setSession } from './session'
import type { ApiErrorBody, ApiErrorCode, ApiResponse, AuthSession, PaginatedResponse, Role } from './types'

export const API_URL = import.meta.env.VITE_API_URL

const ROLES: readonly Role[] = ['customer', 'agent', 'admin']

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  // Public endpoints (login, signup, forgot-password…): no bearer token, and a
  // 401 is returned to the caller instead of triggering refresh / sign-out.
  skipAuth?: boolean
}

interface RawResponse {
  response: Response
  body: unknown
}

type ExecuteOptions = Omit<RequestOptions, 'skipAuth'>

async function execute(endpoint: string, options: ExecuteOptions, token: string | null): Promise<RawResponse> {
  const { body, headers, ...fetchOptions } = options

  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      credentials: 'include',
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        // CSRF guard required by the cookie-authenticated refresh / logout endpoints.
        'X-Requested-With': 'helpdesk',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    throw networkError(cause)
  }

  const parsed: unknown = response.status === 204 ? null : await response.json().catch(() => null)
  return { response, body: parsed }
}

// Refresh (single-flight)

let refreshing: Promise<AuthSession> | null = null

//   Exchanges the refresh cookie for a new access token. Concurrent callers share
//  one in-flight request — refresh tokens rotate and must never be replayed.

export function refreshSession(): Promise<AuthSession> {
  refreshing ??= execute('/auth/refresh', { method: 'POST' }, null)
    .then(({ response, body }) => {
      if (!response.ok) throw toApiError(response, body)
      const session = (body as ApiResponse<AuthSession>).data
      setSession(session)
      emitSessionEvent({ type: 'refreshed', session })
      return session
    })
    .finally(() => {
      refreshing = null
    })

  return refreshing
}

// Request pipeline that handles authentication and error handling

async function request(endpoint: string, { skipAuth, ...options }: RequestOptions = {}): Promise<unknown> {
  if (skipAuth) {
    const { response, body } = await execute(endpoint, options, null)
    if (!response.ok) throw toApiError(response, body)
    return body
  }

  let { response, body } = await execute(endpoint, options, getAccessToken())

  if (errorCodeOf(body) === 'ACCESS_TOKEN_EXPIRED') {
    try {
      await refreshSession()
    } catch (err) {
      // Concurrent requests share one failed refresh; only the first still holding a session ends it.
      if (getAccessToken() !== null) endSessionAfterFailedRefresh(err)
      throw err
    }
    ;({ response, body } = await execute(endpoint, options, getAccessToken()))
  }

  trackRole(response)

  if (!response.ok) {
    const apiError = toApiError(response, body)
    handleAuthFailure(apiError)
    throw apiError
  }

  return body
}

// Resolves with the `data` of a single-resource response (undefined for 204).
export async function apiClient<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const body = await request(endpoint, options)
  return (body as ApiResponse<T> | null)?.data as T
}

// Resolves with `{ data, meta }` for list endpoints.
export async function apiClientPaginated<T>(endpoint: string, options?: RequestOptions): Promise<PaginatedResponse<T>> {
  return (await request(endpoint, options)) as PaginatedResponse<T>
}

// Helpers

// Network / 5xx failures leave the refresh cookie intact, so the session is kept for the next attempt.
function endSessionAfterFailedRefresh(err: unknown): void {
  const code = errorCodeOf(err)
  if (code === 'SESSION_REVOKED' || code === 'UNAUTHENTICATED') {
    clearSession()
    emitSessionEvent({ type: 'signed-out', reason: code === 'SESSION_REVOKED' ? 'idle-expired' : 'unauthenticated' })
  } else if (code === 'ACCOUNT_DEACTIVATED') {
    clearSession()
    emitSessionEvent({ type: 'deactivated' })
  }
}

function handleAuthFailure({ error }: ApiError): void {
  switch (error.code) {
    case 'SESSION_REVOKED':
      clearSession()
      emitSessionEvent({ type: 'signed-out', reason: 'revoked' })
      break
    case 'UNAUTHENTICATED':
      clearSession()
      emitSessionEvent({ type: 'signed-out', reason: 'unauthenticated' })
      break
    case 'ACCOUNT_DEACTIVATED':
      clearSession()
      emitSessionEvent({ type: 'deactivated' })
      break
    case 'FORBIDDEN':
      if (isRole(error.extra?.currentRole)) notifyRole(error.extra.currentRole)
      break
  }
}

// Every authenticated response carries X-User-Role; roles can change live.
function trackRole(response: Response): void {
  const role = response.headers.get('X-User-Role')
  if (isRole(role)) notifyRole(role)
}

function notifyRole(role: Role): void {
  const known = getCurrentRole()
  if (known === null || known === role) return
  setCurrentRole(role)
  emitSessionEvent({ type: 'role-changed', role })
}

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

// Works on both raw response bodies and thrown `ApiError`s — they share the `error.code` shape.
function errorCodeOf(value: unknown): ApiErrorCode | undefined {
  return isErrorEnvelope(value) ? value.error.code : undefined
}

function toApiError(response: Response, body: unknown): ApiError {
  if (isErrorEnvelope(body)) return new ApiError(response.status, body.error)

  const code = statusToCode(response.status)
  return new ApiError(response.status, { code, message: response.statusText || code })
}

function networkError(cause: unknown): ApiError {
  return new ApiError(
    0,
    { code: 'NETWORK_ERROR', message: "Can't reach the server. Check your connection and try again." },
    { cause },
  )
}

// Checks that an unknown value has the `{ error: { code, message } }` shape.
export function isErrorEnvelope(value: unknown): value is { error: ApiErrorBody } {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false
  const { error } = value as { error: unknown }
  return typeof error === 'object' && error !== null && typeof (error as { code?: unknown }).code === 'string'
}

// Maps an HTTP status to the canonical API error code when the body has none.
export function statusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR'
    case 401:
      return 'UNAUTHENTICATED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 429:
      return 'RATE_LIMITED'
    case 500:
      return 'INTERNAL_ERROR'
    case 503:
      return 'SERVICE_UNAVAILABLE'
    default:
      return 'UNKNOWN_ERROR'
  }
}
