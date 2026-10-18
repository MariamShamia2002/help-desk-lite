import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { isNotFound } from '@/api/errors'
import { useAuthStore } from '@/features/auth/store/authStore'

import { getSessions, revokeAllSessions, revokeSession } from '../api/accountApi'
import type { AccountSession } from '../types/account.types'
import { ACCOUNT_QUERY_KEYS } from './useAccount'

export function useSessions() {
  return useQuery({ queryKey: ACCOUNT_QUERY_KEYS.sessions, queryFn: getSessions })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSettled: (_data, error, sessionId) => {
      // Success, or 404 because it already ended elsewhere: either way the row is gone.
      if (error && !isNotFound(error)) return
      queryClient.setQueryData<AccountSession[]>(ACCOUNT_QUERY_KEYS.sessions, (sessions) =>
        sessions?.filter((session) => session.id !== sessionId),
      )
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.sessions })
    },
  })
}

/** The server ends this session too, so drop it locally and let the router send the user to sign in. */
export function useRevokeAllSessions() {
  const endLocalSession = useAuthStore((state) => state.endLocalSession)

  return useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => endLocalSession('signed-out-everywhere'),
  })
}
