import { create } from 'zustand'

import { clearSession, emitSessionEvent, setSession, type SessionEvent } from '@/api/session'
import { isAccountDeactivated } from '@/api/errors'

import { getMe, logout, refreshSession } from '../api/authApi'
import type { AuthSession, AuthStatus, AuthUser, Capability, SignOutReason } from '../types/auth.types'

interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  capabilities: Capability[]
  signOutReason: SignOutReason | null
  roleChanged: boolean
  /** Restores the session from the refresh cookie on app boot. */
  initialize: () => Promise<void>
  completeSignIn: (session: AuthSession) => Promise<void>
  signOut: () => Promise<void>
  /** The server already ended every session; just forget ours locally. */
  endSessionAfterPasswordReset: () => void
  /** For flows where the server already ended this session (e.g. sign out everywhere). */
  endLocalSession: (reason: SignOutReason) => void
  updateUser: (patch: Partial<Pick<AuthUser, 'name'>>) => void
  handleSessionEvent: (event: SessionEvent) => void
  dismissRoleChanged: () => void
}

const signedOutState = {
  user: null,
  capabilities: [],
  roleChanged: false,
} satisfies Partial<AuthState>

export const useAuthStore = create<AuthState>()((set, get) => {
  async function loadMe() {
    const { user, capabilities } = await getMe()
    set({ status: 'authenticated', user, capabilities, signOutReason: null })
  }

  return {
    status: 'idle',
    user: null,
    capabilities: [],
    signOutReason: null,
    roleChanged: false,

    initialize: async () => {
      if (get().status !== 'idle') return
      set({ status: 'loading' })
      try {
        await refreshSession()
        await loadMe()
      } catch (err) {
        clearSession()
        set({ ...signedOutState, status: isAccountDeactivated(err) ? 'deactivated' : 'unauthenticated' })
      }
    },

    completeSignIn: async (session) => {
      setSession(session)
      try {
        await loadMe()
      } catch (err) {
        clearSession()
        throw err
      }
    },

    signOut: async () => {
      try {
        await logout()
      } catch {
        // Server logout failed, but we still sign out locally.
      } finally {
        clearSession()
        emitSessionEvent({ type: 'signed-out', reason: 'manual' })
      }
    },

    endSessionAfterPasswordReset: () => {
      clearSession()
      emitSessionEvent({ type: 'signed-out', reason: 'password-reset' })
    },

    endLocalSession: (reason) => {
      clearSession()
      emitSessionEvent({ type: 'signed-out', reason })
    },

    updateUser: (patch) => {
      const { user } = get()
      if (user) set({ user: { ...user, ...patch } })
    },

    handleSessionEvent: (event) => {
      switch (event.type) {
        case 'signed-out':
          set({ ...signedOutState, status: 'unauthenticated', signOutReason: event.reason })
          break
        case 'deactivated':
          set({ ...signedOutState, status: 'deactivated' })
          break
        case 'role-changed':
          set({ roleChanged: true })
          void loadMe().catch(() => undefined)
          break
        case 'refreshed':
          set({ user: event.session.user })
          break
      }
    },

    dismissRoleChanged: () => set({ roleChanged: false }),
  }
})
