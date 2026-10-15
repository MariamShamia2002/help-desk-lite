import { Link } from 'react-router'

import { Alert, AlertDescription } from '@/components/ui/alert'

import AuthLayout from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'
import { useAuthStore } from '../store/authStore'
import type { SignOutReason } from '../types/auth.types'

const SIGN_OUT_MESSAGES: Record<SignOutReason, string | null> = {
  manual: null,
  'signed-out-everywhere': 'You were signed out on every device.',
  'password-reset': 'Your password was updated. Sign in with your new password.',
  'account-created': 'Your account was created. Please sign in.',
  'idle-expired': 'Your session expired while you were away. Sign in again to continue.',
  revoked: 'You were signed out from another device or by an administrator.',
  unauthenticated: 'Please sign in to continue.',
}

export default function LoginPage() {
  const signOutReason = useAuthStore((state) => state.signOutReason)
  const signOutMessage = signOutReason ? SIGN_OUT_MESSAGES[signOutReason] : null

  return (
    <AuthLayout
      title="Sign in"
      notice={
        signOutMessage && (
          <Alert role="status">
            <AlertDescription>{signOutMessage}</AlertDescription>
          </Alert>
        )
      }
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
