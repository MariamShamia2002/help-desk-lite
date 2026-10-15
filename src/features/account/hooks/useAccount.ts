import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/store/authStore'

import { getAccount, updateAccount } from '../api/accountApi'
import type { UpdateAccountPayload } from '../types/account.types'

export const ACCOUNT_QUERY_KEYS = {
  profile: ['account', 'profile'] as const,
  sessions: ['account', 'sessions'] as const,
}

export function useAccount() {
  return useQuery({ queryKey: ACCOUNT_QUERY_KEYS.profile, queryFn: getAccount })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => updateAccount(payload),
    onSuccess: (account) => {
      queryClient.setQueryData(ACCOUNT_QUERY_KEYS.profile, account)
      // The header reads the signed-in user from the auth store.
      updateUser({ name: account.name })
    },
  })
}
