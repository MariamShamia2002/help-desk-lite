import type { TicketStatus } from '@/features/tickets/types/ticket.types'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Only open and in-progress tickets have a waiting time. */
export function formatWaiting(status: TicketStatus, lastActivityAt: string, now = Date.now()): string {
  if (status !== 'open' && status !== 'progress') return '—'

  const elapsed = now - new Date(lastActivityAt).getTime()
  if (Number.isNaN(elapsed) || elapsed < MINUTE) return 'Just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`
  return `${Math.floor(elapsed / DAY)}d`
}
