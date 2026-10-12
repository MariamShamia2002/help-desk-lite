import type { ApiError, ApiErrorCode } from './types'

export type { ApiError, ApiErrorBody, ApiErrorCode } from './types'

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'error' in err &&
    typeof (err as ApiError).error?.code === 'string'
  )
}

export function hasCode(err: unknown, code: ApiErrorCode): boolean {
  return isApiError(err) && err.error.code === code
}

// Not only VALIDATION_ERROR: e.g. EMAIL_TAKEN also carries `fields.email`.
export function getFieldErrors(err: unknown): Record<string, string> {
  return isApiError(err) ? (err.error.fields ?? {}) : {}
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return isApiError(err) ? err.error.message : fallback
}

// Shown on the 500 page as the reference ID.
export function getRequestId(err: unknown): string | undefined {
  return isApiError(err) ? err.error.requestId : undefined
}

export function getExtra<T = unknown>(err: unknown, key: string): T | undefined {
  return isApiError(err) ? (err.error.extra?.[key] as T | undefined) : undefined
}

// Seconds until a RATE_LIMITED lock ends.
export function getRetryAfterSeconds(err: unknown): number | undefined {
  const value = getExtra<unknown>(err, 'retryAfterSeconds')
  return typeof value === 'number' ? value : undefined
}

export const isNetworkError = (err: unknown) => hasCode(err, 'NETWORK_ERROR')
export const isValidationError = (err: unknown) => hasCode(err, 'VALIDATION_ERROR')
export const isUnauthorized = (err: unknown) => isApiError(err) && err.status === 401
export const isSessionRevoked = (err: unknown) => hasCode(err, 'SESSION_REVOKED')
export const isAccountDeactivated = (err: unknown) => hasCode(err, 'ACCOUNT_DEACTIVATED')
export const isForbidden = (err: unknown) => hasCode(err, 'FORBIDDEN')
export const isNotFound = (err: unknown) => isApiError(err) && err.status === 404
export const isConflict = (err: unknown) => isApiError(err) && err.status === 409
export const isRateLimited = (err: unknown) => hasCode(err, 'RATE_LIMITED')
export const isInternalError = (err: unknown) => isApiError(err) && err.status >= 500
