import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getErrorMessage, getRetryAfterSeconds, isRateLimited, isValidationError } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useCountdown } from '../hooks/useCountdown'
import { useForgotPassword } from '../hooks/usePasswordReset'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/passwordSchemas'
import type { ForgotPasswordResponse } from '../types/auth.types'

const DEFAULT_LOCK_SECONDS = 30

interface ForgotPasswordFormProps {
  onSent: (response: ForgotPasswordResponse) => void
}

export function ForgotPasswordForm({ onSent }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })
  const forgotMutation = useForgotPassword()
  const lock = useCountdown()

  const isLocked = lock.remaining > 0
  const formError = getFormError(forgotMutation.error, lock.remaining)

  const onSubmit = ({ email }: ForgotPasswordFormValues) => {
    forgotMutation.mutate(email, {
      onSuccess: onSent,
      onError: (err) => {
        applyServerFieldErrors(err, setError, ['email'])
        if (isRateLimited(err)) lock.start(getRetryAfterSeconds(err) ?? DEFAULT_LOCK_SECONDS)
      },
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? getErrorId('email') : undefined}
          {...register('email')}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={forgotMutation.isPending || isLocked}>
        {forgotMutation.isPending ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown, lockSeconds: number): string | null {
  if (!error || isValidationError(error)) return null
  if (isRateLimited(error)) {
    return lockSeconds > 0
      ? `Too many requests. Try again in ${lockSeconds} second${lockSeconds === 1 ? '' : 's'}.`
      : null
  }
  return getErrorMessage(error)
}
