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

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'deactivated'
