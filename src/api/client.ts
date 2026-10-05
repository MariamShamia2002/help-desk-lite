import { ApiError } from './errors'
import type { ApiErrorBody } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  body?: unknown
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    const errorBody = (data ?? null) as ApiErrorBody | null
    throw new ApiError(response.status, errorBody?.message ?? response.statusText, errorBody)
  }

  return data as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
