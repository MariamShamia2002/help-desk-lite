import type { TicketCategory, TicketPriority, TicketStatus } from '../types/ticket.types'

export const TICKET_STATUSES = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'progress' },
  { label: 'Waiting on customer', value: 'waiting' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
] as const

export const TICKET_CATEGORIES = [
  { label: 'Bug', value: 'Bug' },
  { label: 'Billing', value: 'Billing' },
  { label: 'Account', value: 'Account' },
  { label: 'Integrations', value: 'Integrations' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Feature request', value: 'Feature request' },
  { label: 'Other', value: 'Other' },
] as const

export const SORT_OPTIONS = [
  { label: 'Newest updated', value: 'desc' },
  { label: 'Oldest updated', value: 'asc' },
] as const

export const TICKET_PRIORITIES = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

export function getStatusLabel(status: TicketStatus): string {
  const found = TICKET_STATUSES.find((s) => s.value === status)
  return found ? found.label : status
}

export function getPriorityLabel(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
    urgent: 'Urgent',
  }
  return labels[priority]
}

export function getCategoryLabel(category: TicketCategory): string {
  const found = TICKET_CATEGORIES.find((c) => c.value === category)
  return found ? found.label : category
}

export function getStatusColor(status: TicketStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'open':
      return 'default'
    case 'progress':
      return 'secondary'
    case 'waiting':
      return 'outline'
    case 'resolved':
      return 'secondary'
    case 'closed':
      return 'outline'
  }
}

export function getPriorityColor(priority: TicketPriority): string {
  switch (priority) {
    case 'low':
      return 'text-muted-foreground'
    case 'normal':
      return 'text-blue-600'
    case 'high':
      return 'text-orange-600'
    case 'urgent':
      return 'text-red-600'
  }
}

/** Status select trigger styles for queue and staff detail. */
export function getStatusSelectClass(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return 'border-sky-200 bg-sky-50 text-sky-700 [&_svg]:text-sky-600'
    case 'progress':
      return 'border-blue-200 bg-blue-50 text-blue-700 [&_svg]:text-blue-600'
    case 'waiting':
      return 'border-amber-200 bg-amber-50 text-amber-800 [&_svg]:text-amber-600'
    case 'resolved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 [&_svg]:text-emerald-600'
    case 'closed':
      return 'border-border bg-muted text-muted-foreground'
  }
}

/** Priority select trigger styles for queue and staff detail. */
export function getPrioritySelectClass(priority: TicketPriority): string {
  switch (priority) {
    case 'low':
      return 'border-border bg-muted text-muted-foreground'
    case 'normal':
      return 'border-sky-200 bg-sky-50 text-sky-700 [&_svg]:text-sky-600'
    case 'high':
      return 'border-orange-200 bg-orange-50 text-orange-700 [&_svg]:text-orange-600'
    case 'urgent':
      return 'border-red-200 bg-red-50 text-red-700 [&_svg]:text-red-600'
  }
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diffSeconds = Math.round((then - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const abs = Math.abs(diffSeconds)
  if (abs < 60) return formatter.format(diffSeconds, 'second')
  if (abs < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute')
  if (abs < 86400) return formatter.format(Math.round(diffSeconds / 3600), 'hour')
  if (abs < 604800) return formatter.format(Math.round(diffSeconds / 86400), 'day')
  if (abs < 2629800) return formatter.format(Math.round(diffSeconds / 604800), 'week')
  if (abs < 31557600) return formatter.format(Math.round(diffSeconds / 2629800), 'month')
  return formatter.format(Math.round(diffSeconds / 31557600), 'year')
}
