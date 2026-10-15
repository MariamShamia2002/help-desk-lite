import { apiClient } from '@/api/client'

import type {
  Account,
  AccountSession,
  ChangePasswordPayload,
  ChangePasswordResponse,
  UpdateAccountPayload,
} from '../types/account.types'

export function getAccount(): Promise<Account> {
  return apiClient<Account>('/account')
}

export function updateAccount(payload: UpdateAccountPayload): Promise<Account> {
  return apiClient<Account>('/account', { method: 'PATCH', body: payload })
}

/** Signs out every other session; this one stays valid. */
export function changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  return apiClient<ChangePasswordResponse>('/account/password', { method: 'POST', body: payload })
}

export function getSessions(): Promise<AccountSession[]> {
  return apiClient<AccountSession[]>('/account/sessions')
}

export function revokeSession(sessionId: string): Promise<void> {
  return apiClient<void>(`/account/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
}

/** Ends every session, including the one making this request. */
export function revokeAllSessions(): Promise<void> {
  return apiClient<void>('/account/sessions/revoke-all', { method: 'POST' })
}
