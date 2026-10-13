import { useMutation } from '@tanstack/react-query'

import { login } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials } from '../types/auth.types'

export function useLogin() {
  const completeSignIn = useAuthStore((state) => state.completeSignIn)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const session = await login(credentials)
      await completeSignIn(session)
    },
  })
}
