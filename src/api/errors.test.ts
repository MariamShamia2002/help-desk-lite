import { describe, expect, it } from 'vitest'

import {
  ApiError,
  getErrorMessage,
  getExtra,
  getFieldErrors,
  getRequestId,
  getRetryAfterSeconds,
  hasCode,
  isAccountDeactivated,
  isApiError,
  isConflict,
  isForbidden,
  isInternalError,
  isNetworkError,
  isNotFound,
  isRateLimited,
  isSessionRevoked,
  isUnauthorized,
  isValidationError,
} from './errors'
import type { ApiErrorBody } from './types'

function apiError(status: number, body: Partial<ApiErrorBody> & Pick<ApiErrorBody, 'code' | 'message'>): ApiError {
  return new ApiError(status, body)
}

describe('isApiError', () => {
  it('is true only for ApiError instances', () => {
    expect(isApiError(apiError(400, { code: 'VALIDATION_ERROR', message: 'Nope' }))).toBe(true)
    expect(isApiError(new Error('Nope'))).toBe(false)
    expect(isApiError(null)).toBe(false)
  })
})

describe('hasCode / typed predicates', () => {
  it('matches on error.code', () => {
    const err = apiError(422, { code: 'VALIDATION_ERROR', message: 'Invalid' })
    expect(hasCode(err, 'VALIDATION_ERROR')).toBe(true)
    expect(hasCode(err, 'FORBIDDEN')).toBe(false)
    expect(isValidationError(err)).toBe(true)
  })

  it('returns false for non-ApiError values', () => {
    expect(hasCode(new Error('x'), 'VALIDATION_ERROR')).toBe(false)
    expect(isNetworkError({})).toBe(false)
  })

  it.each([
    ['NETWORK_ERROR', isNetworkError],
    ['SESSION_REVOKED', isSessionRevoked],
    ['ACCOUNT_DEACTIVATED', isAccountDeactivated],
    ['FORBIDDEN', isForbidden],
    ['RATE_LIMITED', isRateLimited],
  ] as const)('detects %s', (code, predicate) => {
    expect(predicate(apiError(400, { code, message: code }))).toBe(true)
    expect(predicate(apiError(400, { code: 'VALIDATION_ERROR', message: 'other' }))).toBe(false)
  })
})

describe('status-based predicates', () => {
  it('isUnauthorized for 401', () => {
    expect(isUnauthorized(apiError(401, { code: 'UNAUTHENTICATED', message: 'Sign in' }))).toBe(true)
    expect(isUnauthorized(apiError(403, { code: 'FORBIDDEN', message: 'No' }))).toBe(false)
  })

  it('isNotFound for 404', () => {
    expect(isNotFound(apiError(404, { code: 'NOT_FOUND', message: 'Gone' }))).toBe(true)
    expect(isNotFound(apiError(400, { code: 'VALIDATION_ERROR', message: 'Bad' }))).toBe(false)
  })

  it('isConflict for 409', () => {
    expect(isConflict(apiError(409, { code: 'VERSION_CONFLICT', message: 'Stale' }))).toBe(true)
  })

  it('isInternalError for 5xx', () => {
    expect(isInternalError(apiError(500, { code: 'INTERNAL_ERROR', message: 'Boom' }))).toBe(true)
    expect(isInternalError(apiError(503, { code: 'SERVICE_UNAVAILABLE', message: 'Down' }))).toBe(true)
    expect(isInternalError(apiError(400, { code: 'VALIDATION_ERROR', message: 'Bad' }))).toBe(false)
  })
})

describe('getFieldErrors', () => {
  it('returns fields from ApiError, including non-VALIDATION codes', () => {
    expect(
      getFieldErrors(apiError(409, { code: 'EMAIL_TAKEN', message: 'Taken', fields: { email: 'Already in use' } })),
    ).toEqual({ email: 'Already in use' })
  })

  it('returns {} when fields are missing or the value is not an ApiError', () => {
    expect(getFieldErrors(apiError(400, { code: 'VALIDATION_ERROR', message: 'Bad' }))).toEqual({})
    expect(getFieldErrors(new Error('x'))).toEqual({})
  })
})

describe('getErrorMessage', () => {
  it('uses the API message when present', () => {
    expect(getErrorMessage(apiError(400, { code: 'VALIDATION_ERROR', message: 'Title too short' }))).toBe(
      'Title too short',
    )
  })

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(new Error('nope'))).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback')
  })
})

describe('getRequestId / getExtra / getRetryAfterSeconds', () => {
  it('reads requestId when present', () => {
    expect(getRequestId(apiError(500, { code: 'INTERNAL_ERROR', message: 'Boom', requestId: 'req_123' }))).toBe(
      'req_123',
    )
    expect(getRequestId(new Error('x'))).toBeUndefined()
  })

  it('reads typed extras', () => {
    const err = apiError(429, {
      code: 'RATE_LIMITED',
      message: 'Slow down',
      extra: { retryAfterSeconds: 30, reason: 'login' },
    })
    expect(getExtra<number>(err, 'retryAfterSeconds')).toBe(30)
    expect(getExtra<string>(err, 'reason')).toBe('login')
    expect(getExtra(err, 'missing')).toBeUndefined()
  })

  it('only returns retryAfterSeconds when it is a number', () => {
    expect(
      getRetryAfterSeconds(
        apiError(429, { code: 'RATE_LIMITED', message: 'Slow', extra: { retryAfterSeconds: 12 } }),
      ),
    ).toBe(12)
    expect(
      getRetryAfterSeconds(
        apiError(429, { code: 'RATE_LIMITED', message: 'Slow', extra: { retryAfterSeconds: '12' } }),
      ),
    ).toBeUndefined()
    expect(getRetryAfterSeconds(new Error('x'))).toBeUndefined()
  })
})
