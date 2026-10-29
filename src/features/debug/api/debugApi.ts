import { apiClient } from '@/api/client'
import type { Role } from '@/api/types'

export function expireAccessToken(): Promise<unknown> {
  return apiClient('/_debug/expire-access-token', { method: 'POST' })
}

export function expireSession(): Promise<unknown> {
  return apiClient('/_debug/expire-session', { method: 'POST' })
}

export function revokeRefreshToken(): Promise<unknown> {
  return apiClient('/_debug/revoke-refresh-token', { method: 'POST' })
}

export function setDebugRole(role: Role): Promise<unknown> {
  return apiClient('/_debug/set-role', { method: 'POST', body: { role } })
}

export function deactivateMe(): Promise<unknown> {
  return apiClient('/_debug/deactivate-me', { method: 'POST' })
}

export function armAssignmentConflict(): Promise<unknown> {
  return apiClient('/_debug/arm-assignment-conflict', { method: 'POST' })
}

export function deleteTicketElsewhere(ticketId: number): Promise<unknown> {
  return apiClient(`/_debug/tickets/${ticketId}`, { method: 'DELETE' })
}

export function resetDemoData(): Promise<unknown> {
  return apiClient('/_debug/reset', { method: 'POST' })
}
