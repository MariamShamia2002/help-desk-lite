import { useMutation } from '@tanstack/react-query'

import { signup } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { SignupPayload } from '../types/auth.types'

/** Signup signs the new customer straight in. */
export function useSignup() {
  const completeSignIn = useAuthStore((state) => state.completeSignIn)

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const session = await signup(payload)
      await completeSignIn(session)
    },
  })
}
