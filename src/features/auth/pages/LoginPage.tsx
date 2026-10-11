import { Link } from 'react-router'

import { Logo } from '@/components/shared/Logo'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { LoginForm } from '../components/LoginForm'
import { useAuthStore } from '../store/authStore'
import type { SignOutReason } from '../types/auth.types'

const SIGN_OUT_MESSAGES: Record<SignOutReason, string | null> = {
  manual: null,
  'idle-expired': 'Your session expired while you were away. Sign in again to continue.',
  revoked: 'You were signed out from another device or by an administrator.',
  unauthenticated: 'Please sign in to continue.',
}

export default function LoginPage() {
  const signOutReason = useAuthStore((state) => state.signOutReason)
  const signOutMessage = signOutReason ? SIGN_OUT_MESSAGES[signOutReason] : null

  return (
    <main className="flex min-h-svh flex-col items-center bg-background px-4 py-12">
      <Logo />

      <div className="mt-8 flex w-full max-w-sm flex-col gap-4">
        {signOutMessage && (
          <Alert role="status">
            <AlertDescription>{signOutMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="font-heading text-xl font-semibold">Sign in</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New here?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
