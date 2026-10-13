import { useCallback } from 'react'

import { getRetryAfterSeconds, isRateLimited } from '@/api/errors'

import { useCountdown } from './useCountdown'

// The server only reports the real duration (`retryAfterSeconds`) once the lock is active.
export const DEFAULT_LOCK_SECONDS = 30

/** Locks a form after a RATE_LIMITED error and counts down until it can be submitted again. */
export function useRateLimitLock() {
  const { remaining, start } = useCountdown()

  const handleError = useCallback(
    (err: unknown) => {
      if (isRateLimited(err)) start(getRetryAfterSeconds(err) ?? DEFAULT_LOCK_SECONDS)
    },
    [start],
  )

  const isLocked = remaining > 0
  const message = isLocked ? `Too many attempts. Try again in ${remaining} second${remaining === 1 ? '' : 's'}.` : null

  return { isLocked, remaining, message, handleError }
}
