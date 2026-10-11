import { apiClient } from '@/api/client'

import type {
  AuthSession,
  ForgotPasswordResponse,
  LoginCredentials,
  MeResponse,
  ResetPasswordPayload,
  SignupPayload,
} from '../types/auth.types'

export { refreshSession } from '@/api/client'

export function login(credentials: LoginCredentials): Promise<AuthSession> {
  return apiClient<AuthSession>('/auth/login', { method: 'POST', body: credentials, skipAuth: true })
}

export function signup(payload: SignupPayload): Promise<AuthSession> {
  return apiClient<AuthSession>('/auth/signup', { method: 'POST', body: payload, skipAuth: true })
}

export function getMe(): Promise<MeResponse> {
  return apiClient<MeResponse>('/auth/me')
}

export function logout(): Promise<void> {
  return apiClient<void>('/auth/logout', { method: 'POST', skipAuth: true })
}

export function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return apiClient<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
    skipAuth: true,
  })
}

/** Resolves when the token is usable; rejects with a RESET_TOKEN_* error otherwise. */
export function validateResetToken(token: string): Promise<{ valid: true }> {
  return apiClient<{ valid: true }>(`/auth/reset-password/${encodeURIComponent(token)}`, { skipAuth: true })
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ ok: true }> {
  return apiClient<{ ok: true }>('/auth/reset-password', { method: 'POST', body: payload, skipAuth: true })
}
