import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { logout, signup } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { SignupPayload } from '../types/auth.types'

/** Signup signs the new customer straight in. */
export function useSignup() {
  const navigate = useNavigate()
  const completeSignIn = useAuthStore((state) => state.completeSignIn)
  const endLocalSession = useAuthStore((state) => state.endLocalSession)

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const session = await signup(payload)
      try {
        await completeSignIn(session)
      } catch {
        // The account exists now, so submitting again would only fail with EMAIL_TAKEN.
        // Awaited so the logout response can't clear the cookie of the user's next sign-in.
        await logout().catch(() => undefined)
        endLocalSession('account-created')
        navigate('/login', { replace: true })
      }
    },
  })
}
