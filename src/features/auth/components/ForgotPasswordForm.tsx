import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getErrorMessage, isRateLimited, isValidationError } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useForgotPassword } from '../hooks/usePasswordReset'
import { useRateLimitLock } from '../hooks/useRateLimitLock'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/passwordSchemas'
import type { ForgotPasswordResponse } from '../types/auth.types'

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
  const lock = useRateLimitLock()

  const formError = getFormError(forgotMutation.error, lock.message)

  const onSubmit = ({ email }: ForgotPasswordFormValues) => {
    forgotMutation.mutate(email, {
      onSuccess: onSent,
      onError: (err) => {
        applyServerFieldErrors(err, setError, ['email'])
        lock.handleError(err)
      },
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {formError && (
        <Alert variant="destructive">
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

      <Button type="submit" size="lg" disabled={forgotMutation.isPending || lock.isLocked}>
        {forgotMutation.isPending ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown, lockMessage: string | null): string | null {
  if (!error || isValidationError(error)) return null
  if (isRateLimited(error)) return lockMessage
  return getErrorMessage(error)
}
