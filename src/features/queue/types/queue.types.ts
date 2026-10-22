import type { TicketCategory, TicketPerson, TicketPriority, TicketStatus } from '@/features/tickets/types/ticket.types'

/** One row from `GET /queue`. The list does not include `version` or `permissions`. */
export interface QueueItem {
  id: number
  title: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory | null
  requester: TicketPerson
  assignee: TicketPerson | null
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

/** `GET /staff/agents` item. */
export interface StaffAgent {
  id: string
  name: string
  role: 'agent' | 'admin'
}

/** `assignee` query: `me`, `unassigned`, `all`, or a staff user id. */
export type QueueAssignee = 'me' | 'unassigned' | 'all' | (string & {})

export interface QueueQueryParams {
  status?: TicketStatus | 'all'
  priority?: TicketPriority | 'all'
  assignee?: QueueAssignee
  /** Sent to the API as `q`. Searches titles and requester names. */
  search?: string
  sort?: 'asc' | 'desc'
  page?: number
  limit?: number
}
