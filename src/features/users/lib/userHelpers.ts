import type { Role } from '@/api/types'
import { formatLastActive } from '@/features/account/lib/formatLastActive'

export const USER_ROLE_FILTERS = [
  { label: 'All roles', value: 'all' },
  { label: 'Customer', value: 'customer' },
  { label: 'Agent', value: 'agent' },
  { label: 'Admin', value: 'admin' },
] as const

export const USER_STATUS_FILTERS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Deactivated', value: 'deactivated' },
] as const

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    customer: 'Customer',
    agent: 'Agent',
    admin: 'Admin',
  }
  return labels[role]
}

export function getActiveLabel(active: boolean): 'Active' | 'Deactivated' {
  return active ? 'Active' : 'Deactivated'
}

export function getActiveBadgeVariant(active: boolean): 'default' | 'secondary' {
  return active ? 'default' : 'secondary'
}

/** Last active column: em dash, "Active now", or relative time from account helper. */
export function formatUserLastActive(lastActiveAt: string | null, now: number = Date.now()): string {
  if (lastActiveAt === null) return '—'
  const formatted = formatLastActive(lastActiveAt, now)
  return formatted === 'Just now' ? 'Active now' : formatted
}
