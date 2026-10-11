import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getErrorMessage, getRetryAfterSeconds, hasCode, isRateLimited, isValidationError } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useCountdown } from '../hooks/useCountdown'
import { useSignup } from '../hooks/useSignup'
import { signupSchema, type SignupFormValues } from '../schemas/passwordSchemas'
import { NewPasswordField } from './NewPasswordField'

const DEFAULT_LOCK_SECONDS = 30

/** On success the user is signed in and `GuestRoute` redirects. */
export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })
  const password = useWatch({ control, name: 'password' })
  const signupMutation = useSignup()
  const lock = useCountdown()

  const isLocked = lock.remaining > 0
  const formError = getFormError(signupMutation.error, lock.remaining)

  const onSubmit = ({ name, email, password: newPassword }: SignupFormValues) => {
    signupMutation.mutate(
      { name, email, password: newPassword },
      {
        onError: (err) => {
          applyServerFieldErrors(err, setError, ['name', 'email', 'password'])
          if (isRateLimited(err)) lock.start(getRetryAfterSeconds(err) ?? DEFAULT_LOCK_SECONDS)
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

      <FormField id="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          autoFocus
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? getErrorId('name') : undefined}
          {...register('name')}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? getErrorId('email') : undefined}
          {...register('email')}
        />
      </FormField>

      <NewPasswordField
        id="password"
        label="Password"
        password={password}
        error={errors.password?.message}
        registration={register('password')}
      />

      <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? getErrorId('confirmPassword') : undefined}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={signupMutation.isPending || isLocked}>
        {signupMutation.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown, lockSeconds: number): string | null {
  // EMAIL_TAKEN and validation errors are shown on the fields themselves.
  if (!error || isValidationError(error) || hasCode(error, 'EMAIL_TAKEN')) return null
  if (isRateLimited(error)) {
    return lockSeconds > 0
      ? `Too many attempts. Try again in ${lockSeconds} second${lockSeconds === 1 ? '' : 's'}.`
      : null
  }
  return getErrorMessage(error)
}
