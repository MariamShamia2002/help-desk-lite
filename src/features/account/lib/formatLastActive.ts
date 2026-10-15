const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

/** "Just now", "12m ago", "3h ago", "2d ago", then a short date. */
export function formatLastActive(iso: string, now: number = Date.now()): string {
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return 'Last activity unknown'

  const seconds = Math.max(0, Math.floor((now - time) / 1000))
  if (seconds < MINUTE) return 'Just now'
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`
  if (seconds < MONTH) return `${Math.floor(seconds / DAY)}d ago`
  return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
