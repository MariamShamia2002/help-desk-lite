import { apiClient, apiClientPaginated } from '@/api/client'
import type { PaginatedResponse } from '@/api/types'

import type {
  AdminUser,
  AdminUserSession,
  CreateUserPayload,
  CreateUserResponse,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
  UsersQueryParams,
} from '../types/user.types'

export async function fetchUsers(params: UsersQueryParams): Promise<PaginatedResponse<AdminUser>> {
  const searchParams = new URLSearchParams()

  if (params.q) {
    searchParams.set('q', params.q)
  }
  if (params.role !== 'all') {
    searchParams.set('role', params.role)
  }
  if (params.status !== 'all') {
    searchParams.set('status', params.status)
  }
  searchParams.set('page', params.page.toString())
  searchParams.set('limit', params.limit.toString())

  const query = searchParams.toString()
  return apiClientPaginated<AdminUser>(`/users?${query}`)
}

export function createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
  return apiClient<CreateUserResponse>('/users', { method: 'POST', body: payload })
}

export function updateUserRole(userId: string, payload: UpdateUserRolePayload): Promise<AdminUser> {
  return apiClient<AdminUser>(`/users/${encodeURIComponent(userId)}/role`, {
    method: 'PATCH',
    body: payload,
  })
}

export function updateUserStatus(userId: string, payload: UpdateUserStatusPayload): Promise<AdminUser> {
  return apiClient<AdminUser>(`/users/${encodeURIComponent(userId)}/status`, {
    method: 'PATCH',
    body: payload,
  })
}

export function fetchUserSessions(userId: string): Promise<AdminUserSession[]> {
  return apiClient<AdminUserSession[]>(`/users/${encodeURIComponent(userId)}/sessions`)
}

export function revokeAllUserSessions(userId: string): Promise<void> {
  return apiClient<void>(`/users/${encodeURIComponent(userId)}/sessions/revoke-all`, { method: 'POST' })
}
