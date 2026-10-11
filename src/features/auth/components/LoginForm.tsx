import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'

import {
  getErrorMessage,
  getExtra,
  getFieldErrors,
  getRetryAfterSeconds,
  hasCode,
  isRateLimited,
  isValidationError,
} from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorId } from '@/lib/form'

import { useCountdown } from '../hooks/useCountdown'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'

const DEFAULT_LOCK_SECONDS = 30

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
  const lock = useCountdown()

  const isLocked = lock.remaining > 0
  const formError = getFormError(loginMutation.error, lock.remaining)

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onError: (err) => {
        Object.entries(getFieldErrors(err)).forEach(([field, message]) => {
          if (field === 'email' || field === 'password') setError(field, { message })
        })
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
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? getErrorId('password') : undefined}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={loginMutation.isPending || isLocked}>
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

function getFormError(error: unknown, lockSeconds: number): string | null {
  if (!error || isValidationError(error)) return null

  if (isRateLimited(error)) {
    return lockSeconds > 0
      ? `Too many attempts. Try again in ${lockSeconds} second${lockSeconds === 1 ? '' : 's'}.`
      : null
  }

  if (hasCode(error, 'INVALID_CREDENTIALS')) {
    const attemptsLeft = getExtra<number>(error, 'attemptsLeft')
    const suffix =
      typeof attemptsLeft === 'number'
        ? ` ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left before sign-in is locked for 30 seconds.`
        : ''
    return `Email or password is incorrect.${suffix}`
  }

  return getErrorMessage(error)
}
