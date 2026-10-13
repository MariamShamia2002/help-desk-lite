import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { getFieldErrors } from '@/api/errors'

/** Id of a field's error message, for `aria-describedby`. */
export function getErrorId(id: string): string {
  return `${id}-error`
}

/**
 * Puts server `fields` errors onto the matching form fields.
 * Only listed fields are mapped; returns true if any were applied.
 */
export function applyServerFieldErrors<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): boolean {
  let applied = false
  Object.entries(getFieldErrors(err)).forEach(([field, message]) => {
    const match = fields.find((name) => name === field)
    if (!match) return
    setError(match, { type: 'server', message }, { shouldFocus: !applied })
    applied = true
  })
  return applied
}
