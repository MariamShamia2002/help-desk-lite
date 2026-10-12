import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getErrorMessage, isApiError, isValidationError } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { PasswordInput } from '@/components/shared/PasswordInput'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useResetPassword } from '../hooks/usePasswordReset'
import { isResetTokenErrorCode } from '../lib/resetToken'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/passwordSchemas'
import type { ResetTokenErrorCode } from '../types/auth.types'
import { NewPasswordField } from './NewPasswordField'

interface ResetPasswordFormProps {
  token: string
  onSuccess: () => void
  /** The link stopped working while the form was open (e.g. used in another tab). */
  onTokenError: (code: ResetTokenErrorCode) => void
}

export function ResetPasswordForm({ token, onSuccess, onTokenError }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })
  const password = useWatch({ control, name: 'password' })
  const resetMutation = useResetPassword()

  const formError = getFormError(resetMutation.error)

  const onSubmit = ({ password: newPassword }: ResetPasswordFormValues) => {
    resetMutation.mutate(
      { token, password: newPassword },
      {
        onSuccess,
        onError: (err) => {
          const code = isApiError(err) ? err.error.code : undefined
          if (isResetTokenErrorCode(code)) return onTokenError(code)
          applyServerFieldErrors(err, setError, ['password'])
        },
      },
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <NewPasswordField
        id="password"
        label="New password"
        password={password}
        error={errors.password?.message}
        registration={register('password')}
      />

      <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? getErrorId('confirmPassword') : undefined}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={resetMutation.isPending}>
        {resetMutation.isPending ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown): string | null {
  if (!error || isValidationError(error)) return null
  if (isApiError(error) && isResetTokenErrorCode(error.error.code)) return null
  return getErrorMessage(error)
}
