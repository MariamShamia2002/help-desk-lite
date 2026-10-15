import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'

import { getErrorMessage, getExtra, hasCode, isRateLimited, isValidationError } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { PasswordInput } from '@/components/shared/PasswordInput'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useLogin } from '../hooks/useLogin'
import { DEFAULT_LOCK_SECONDS, useRateLimitLock } from '../hooks/useRateLimitLock'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'

/** On success the auth store flips to authenticated and `GuestRoute` redirects. */
export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const loginMutation = useLogin()
  const lock = useRateLimitLock()

  const formError = getFormError(loginMutation.error, lock.message)

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onError: (err) => {
        applyServerFieldErrors(err, setError, ['email', 'password'])
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

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
        labelAction={
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? getErrorId('password') : undefined}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={loginMutation.isPending || lock.isLocked}>
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown, lockMessage: string | null): string | null {
  if (!error || isValidationError(error)) return null
  if (isRateLimited(error)) return lockMessage

  if (hasCode(error, 'INVALID_CREDENTIALS')) {
    const attemptsLeft = getExtra<number>(error, 'attemptsLeft')
    const suffix =
      typeof attemptsLeft === 'number'
        ? ` ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left before sign-in is locked for ${DEFAULT_LOCK_SECONDS} seconds.`
        : ''
    return `Email or password is incorrect.${suffix}`
  }

  return getErrorMessage(error)
}
