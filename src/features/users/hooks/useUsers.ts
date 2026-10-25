import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { fetchUsers } from '../api/usersApi'
import type { AdminUser, UsersQueryParams } from '../types/user.types'

export function useUsers(
  params: UsersQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<AdminUser>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<PaginatedResponse<AdminUser>>({
    ...options,
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  })
}
