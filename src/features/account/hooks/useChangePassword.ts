import { useMutation, useQueryClient } from '@tanstack/react-query'

import { changePassword } from '../api/accountApi'
import type { ChangePasswordPayload } from '../types/account.types'
import { ACCOUNT_QUERY_KEYS } from './useAccount'

export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    // The server signed out every other session.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.sessions }),
  })
}
