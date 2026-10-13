import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { getErrorId } from '@/lib/form'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  /** Rendered on the right of the label row (e.g. "Forgot password?"). */
  labelAction?: ReactNode
  children: ReactNode
}

/** The input inside must set `aria-invalid` and `aria-describedby={getErrorId(id)}`. */
export function FormField({ id, label, error, labelAction, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      {children}
      {error && (
        <p id={getErrorId(id)} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
