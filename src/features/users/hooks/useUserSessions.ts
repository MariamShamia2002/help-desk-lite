import { useQuery } from '@tanstack/react-query'

import { fetchUserSessions } from '../api/usersApi'
import type { AdminUserSession } from '../types/user.types'

export function useUserSessions(userId: string | undefined, enabled: boolean) {
  return useQuery<AdminUserSession[]>({
    queryKey: ['users', userId, 'sessions'],
    queryFn: () => fetchUserSessions(userId!),
    enabled: Boolean(userId) && enabled,
  })
}
