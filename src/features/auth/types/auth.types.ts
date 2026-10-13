import type { AuthUser } from '@/api/types'

export type { AuthSession, AuthUser, Role } from '@/api/types'
export type { SignOutReason } from '@/api/session'

export type Capability =
  | 'tickets:create'
  | 'tickets:view-own'
  | 'queue:view'
  | 'tickets:view-all'
  | 'tickets:reply-internal'
  | 'tickets:triage'
  | 'staff:list'
  | 'users:manage'
  | 'tickets:delete'

export interface MeResponse {
  user: AuthUser
  capabilities: Capability[]
}

export interface LoginCredentials {
  email: string
  password: string
}

/** The body is strict server-side: never send `confirmPassword` or `role`. */
export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordResponse {
  message: string
  /** Debug builds only: there's no real email delivery. */
  devResetLink?: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export type ResetTokenErrorCode = 'RESET_TOKEN_INVALID' | 'RESET_TOKEN_EXPIRED' | 'RESET_TOKEN_USED'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'deactivated'
