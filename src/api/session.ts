import type { AuthSession, Role } from './types'

//   The access token lives in memory only (never localStorage).
//   The refresh token is an httpOnly cookie the browser manages for us.

let accessToken: string | null = null
let currentRole: Role | null = null

export type SignOutReason =
  | 'manual'
  | 'signed-out-everywhere'
  | 'password-reset'
  | 'account-created'
  | 'idle-expired'
  | 'revoked'
  | 'unauthenticated'

export type SessionEvent =
  | { type: 'refreshed'; session: AuthSession }
  | { type: 'signed-out'; reason: SignOutReason }
  | { type: 'deactivated' }
  | { type: 'role-changed'; role: Role }

type SessionListener = (event: SessionEvent) => void

const listeners = new Set<SessionListener>()

export function getAccessToken(): string | null {
  return accessToken
}

export function getCurrentRole(): Role | null {
  return currentRole
}

export function setSession(session: AuthSession): void {
  accessToken = session.accessToken
  currentRole = session.user.role
}

export function setCurrentRole(role: Role): void {
  currentRole = role
}

export function clearSession(): void {
  accessToken = null
  currentRole = null
}

export function onSessionEvent(listener: SessionListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitSessionEvent(event: SessionEvent): void {
  listeners.forEach((listener) => listener(event))
}
