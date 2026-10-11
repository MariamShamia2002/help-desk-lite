import { useMutation, useQuery } from '@tanstack/react-query'

import { forgotPassword, resetPassword, validateResetToken } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { ResetPasswordPayload } from '../types/auth.types'

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => forgotPassword(email) })
}

export function useResetToken(token: string | null) {
  return useQuery({
    queryKey: ['auth', 'reset-token', token],
    queryFn: () => validateResetToken(token ?? ''),
    enabled: Boolean(token),
    // A token's state only changes when it's used or expires; don't refetch behind the user's back.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

/** Success signs out every session server-side, so drop ours too. */
export function useResetPassword() {
  const endSessionAfterPasswordReset = useAuthStore((state) => state.endSessionAfterPasswordReset)

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: endSessionAfterPasswordReset,
  })
}
