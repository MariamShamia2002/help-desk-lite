import { apiClient } from '@/api/client'

import type { AuthSession, LoginCredentials, MeResponse } from '../types/auth.types'

export { refreshSession } from '@/api/client'

export function login(credentials: LoginCredentials): Promise<AuthSession> {
  return apiClient<AuthSession>('/auth/login', { method: 'POST', body: credentials, skipAuth: true })
}

export function getMe(): Promise<MeResponse> {
  return apiClient<MeResponse>('/auth/me')
}

export function logout(): Promise<void> {
  return apiClient<void>('/auth/logout', { method: 'POST', skipAuth: true })
}
