import type { ResetTokenErrorCode } from '../types/auth.types'

export const RESET_TOKEN_MESSAGES: Record<ResetTokenErrorCode, { title: string; description: string }> = {
  RESET_TOKEN_INVALID: {
    title: "This reset link isn't valid",
    description: 'It may have been copied incorrectly. Request a new link to try again.',
  },
  RESET_TOKEN_EXPIRED: {
    title: 'This reset link has expired',
    description: 'Reset links only work for a limited time. Request a new one to continue.',
  },
  RESET_TOKEN_USED: {
    title: 'This reset link has already been used',
    description: 'Each link works only once. If you still need to reset your password, request a new link.',
  },
}

export function isResetTokenErrorCode(code: unknown): code is ResetTokenErrorCode {
  return typeof code === 'string' && code in RESET_TOKEN_MESSAGES
}
