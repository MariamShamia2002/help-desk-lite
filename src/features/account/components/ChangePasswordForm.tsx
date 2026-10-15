import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { PasswordInput } from '@/components/shared/PasswordInput'
import { Button } from '@/components/ui/button'
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useChangePassword } from '../hooks/useChangePassword'
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas/accountSchemas'

const EMPTY_VALUES: ChangePasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }
const METER_ID = 'new-password-strength'

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY_VALUES,
  })
  const newPassword = useWatch({ control, name: 'newPassword' })
  const changeMutation = useChangePassword()

  const newPasswordDescribedBy = [METER_ID, errors.newPassword && getErrorId('newPassword')].filter(Boolean).join(' ')

  const onSubmit = ({ currentPassword, newPassword: password }: ChangePasswordFormValues) => {
    changeMutation.mutate(
      { currentPassword, newPassword: password },
      {
        onSuccess: ({ otherSessionsRevoked }) => {
          reset(EMPTY_VALUES)
          toast.success(
            otherSessionsRevoked > 0
              ? `Password updated. ${otherSessionsRevoked} other session${otherSessionsRevoked === 1 ? '' : 's'} signed out.`
              : 'Password updated.',
          )
        },
        onError: (err) => {
          if (!applyServerFieldErrors(err, setError, ['currentPassword', 'newPassword'])) {
            toast.error(getErrorMessage(err))
          }
        },
      },
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="currentPassword" label="Current password" error={errors.currentPassword?.message}>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            className="h-12 bg-card"
            aria-invalid={errors.currentPassword ? true : undefined}
            aria-describedby={errors.currentPassword ? getErrorId('currentPassword') : undefined}
            {...register('currentPassword')}
          />
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="newPassword" label="New password" error={errors.newPassword?.message}>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            className="h-12 bg-card"
            aria-invalid={errors.newPassword ? true : undefined}
            aria-describedby={newPasswordDescribedBy}
            {...register('newPassword')}
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            className="h-12 bg-card"
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? getErrorId('confirmPassword') : undefined}
            {...register('confirmPassword')}
          />
        </FormField>
      </div>

      <PasswordStrengthMeter id={METER_ID} password={newPassword} layout="inline" />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" size="lg" disabled={changeMutation.isPending}>
          {changeMutation.isPending ? 'Updating…' : 'Update password'}
        </Button>
        <p className="text-sm text-muted-foreground">Changing your password signs out your other sessions.</p>
      </div>
    </form>
  )
}
