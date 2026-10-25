import { useMutation, useQueryClient } from '@tanstack/react-query'

import { revokeAllUserSessions } from '../api/usersApi'

export function useRevokeAllUserSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => revokeAllUserSessions(userId),
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({ queryKey: ['users', userId, 'sessions'] })
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
