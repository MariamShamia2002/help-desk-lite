export type TicketStatus = 'open' | 'progress' | 'waiting' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

export type TicketCategory =
  'bug' | 'billing' | 'account' | 'integrations' | 'performance' | 'feature_request' | 'other'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category?: TicketCategory
  requesterId: string
  assigneeId?: string
  replyCount: number
  createdAt: string
  updatedAt: string
}

export interface TicketListItem {
  id: string
  title: string
  status: TicketStatus
  priority: TicketPriority
  category?: TicketCategory
  replyCount: number
  createdAt: string
  updatedAt: string
}

export interface TicketsQueryParams {
  status?: TicketStatus | 'all'
  sort?: 'asc' | 'desc'
  page?: number
  limit?: number
  search?: string
}

export interface CreateTicketPayload {
  title: string
  description: string
  category?: TicketCategory
}

export interface CreateTicketResponse {
  id: string
  title: string
  status: TicketStatus
  createdAt: string
}
