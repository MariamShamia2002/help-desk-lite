import type { UseFormRegisterReturn } from 'react-hook-form'

import { FormField } from '@/components/shared/FormField'
import { PasswordInput } from '@/components/shared/PasswordInput'
import { getErrorId } from '@/lib/form'

interface ConfirmPasswordFieldProps {
  id: string
  label: string
  error?: string
  registration: UseFormRegisterReturn
}

export function ConfirmPasswordField({ id, label, error, registration }: ConfirmPasswordFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <PasswordInput
        id={id}
        autoComplete="new-password"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? getErrorId(id) : undefined}
        {...registration}
      />
    </FormField>
  )
}
