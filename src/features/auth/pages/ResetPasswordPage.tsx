import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { getErrorMessage, isApiError } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import AuthLayout from '../components/AuthLayout'
import { BackLink } from '../components/BackLink'
import { ResetPasswordForm } from '../components/ResetPasswordForm'
import { useResetToken } from '../hooks/usePasswordReset'
import { isResetTokenErrorCode, RESET_TOKEN_MESSAGES } from '../lib/resetToken'
import type { ResetTokenErrorCode } from '../types/auth.types'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const tokenQuery = useResetToken(token)
  const [tokenErrorAfterSubmit, setTokenErrorAfterSubmit] = useState<ResetTokenErrorCode | null>(null)

  const queryErrorCode = isApiError(tokenQuery.error) ? tokenQuery.error.error.code : undefined
  const tokenError: ResetTokenErrorCode | null = !token
    ? 'RESET_TOKEN_INVALID'
    : (tokenErrorAfterSubmit ?? (isResetTokenErrorCode(queryErrorCode) ? queryErrorCode : null))

  if (tokenError) return <ResetTokenProblem code={tokenError} />

  if (tokenQuery.isPending) {
    return (
      <AuthLayout title="Reset your password" footer={<BackLink />}>
        <div role="status" className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Checking your reset link…
        </div>
      </AuthLayout>
    )
  }

  if (tokenQuery.isError) {
    return (
      <AuthLayout title="Reset your password" footer={<BackLink />}>
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(tokenQuery.error)}</AlertDescription>
          </Alert>
          <Button variant="outline" size="lg" onClick={() => void tokenQuery.refetch()}>
            Try again
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="This signs you out on every device."
      footer={<BackLink />}
      wide
    >
      <ResetPasswordForm
        token={token ?? ''}
        onSuccess={() => navigate('/login', { replace: true })}
        onTokenError={setTokenErrorAfterSubmit}
      />
    </AuthLayout>
  )
}

interface ResetTokenProblemProps {
  code: ResetTokenErrorCode
}

function ResetTokenProblem({ code }: ResetTokenProblemProps) {
  const { title, description } = RESET_TOKEN_MESSAGES[code]

  return (
    <AuthLayout title={title} description={description} footer={<BackLink />}>
      <Button nativeButton={false} size="lg" className="w-full" render={<Link to="/forgot-password" />}>
        Request a new link
      </Button>
    </AuthLayout>
  )
}
