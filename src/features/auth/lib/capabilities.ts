import type { Capability } from '../types/auth.types'

/** UI decisions come from capabilities, never from `role === '…'`. */
export function hasCapability(capabilities: readonly Capability[], required: Capability | readonly Capability[]): boolean {
  const needed = typeof required === 'string' ? [required] : required
  return needed.every((capability) => capabilities.includes(capability))
}

export function getHomePath(capabilities: readonly Capability[]): string {
  if (capabilities.includes('queue:view')) return '/queue'
  if (capabilities.includes('tickets:view-own')) return '/tickets'
  return '/'
}

/** Only allow same-app paths, so `?returnTo=` can't redirect off-site. */
export function getSafeReturnTo(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null
  return value
}
