import type { Role } from '@/api/types'

export interface Account {
  id: string
  name: string
  email: string
  role: Role
}

/** Bodies are strict server-side: only `name` is accepted here. */
export interface UpdateAccountPayload {
  name: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  otherSessionsRevoked: number
}

export interface AccountSession {
  id: string
  device: string
  ipMasked: string | null
  location: string | null
  createdAt: string
  lastUsedAt: string
  /** The session this browser is using. */
  current: boolean
}
