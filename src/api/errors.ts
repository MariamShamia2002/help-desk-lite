import type { ApiErrorBody } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorBody | null

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isUnauthorized(error: unknown): boolean {
  return isApiError(error) && error.status === 401
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isApiError(error) || !error.body?.errors) return {}

  return Object.fromEntries(
    Object.entries(error.body.errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? (messages[0] ?? '') : messages,
    ]),
  )
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
