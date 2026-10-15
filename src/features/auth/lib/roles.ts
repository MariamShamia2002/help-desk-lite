import type { Role } from '../types/auth.types'

/** Display labels only. Never use the role to decide what the UI allows; use capabilities. */
export const ROLE_LABELS: Record<Role, string> = {
  customer: 'Customer',
  agent: 'Agent',
  admin: 'Admin',
}
