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
  { label: 'Bug', value: 'bug' },
  { label: 'Billing', value: 'billing' },
  { label: 'Account', value: 'account' },
  { label: 'Integrations', value: 'integrations' },
  { label: 'Performance', value: 'performance' },
  { label: 'Feature request', value: 'feature_request' },
  { label: 'Other', value: 'other' },
] as const

export const SORT_OPTIONS = [
  { label: 'Newest updated', value: 'desc' },
  { label: 'Oldest updated', value: 'asc' },
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
