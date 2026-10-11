import type { UseFormRegisterReturn } from 'react-hook-form'

import { FormField } from '@/components/shared/FormField'
import { Input } from '@/components/ui/input'
import { getErrorId } from '@/lib/form'

import { PasswordStrengthMeter } from './PasswordStrengthMeter'

interface NewPasswordFieldProps {
  id: string
  label: string
  /** Current value, to drive the meter. */
  password: string
  error?: string
  registration: UseFormRegisterReturn
}

export function NewPasswordField({ id, label, password, error, registration }: NewPasswordFieldProps) {
  const meterId = `${id}-strength`
  const describedBy = [meterId, error && getErrorId(id)].filter(Boolean).join(' ')

  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        type="password"
        autoComplete="new-password"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...registration}
      />
      <PasswordStrengthMeter id={meterId} password={password} />
    </FormField>
  )
}
