import type { Role } from '@/api/types'

export type UserRoleFilter = Role | 'all'
export type UserStatusFilter = 'all' | 'active' | 'deactivated'
export type StaffRole = Extract<Role, 'agent' | 'admin'>

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  lastActiveAt: string | null
  createdAt: string
  ticketsCount: number
}

export interface UsersQueryParams {
  q?: string
  role: UserRoleFilter
  status: UserStatusFilter
  page: number
  limit: number
}

export interface CreateUserPayload {
  name: string
  email: string
  role: StaffRole
}

export interface CreateUserResponse {
  user: AdminUser
  temporaryPassword: string
}

export interface UpdateUserRolePayload {
  role: Role
}

export interface UpdateUserStatusPayload {
  active: boolean
}

/** Admin view of another user's sessions — same fields as account sessions. */
export interface AdminUserSession {
  id: string
  device: string
  ipMasked: string | null
  location: string | null
  createdAt: string
  lastUsedAt: string
  current: boolean
}
