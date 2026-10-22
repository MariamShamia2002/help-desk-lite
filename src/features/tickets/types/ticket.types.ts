export type TicketStatus = 'open' | 'progress' | 'waiting' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

/** Exact enum values from the API contract. */
export type TicketCategory =
  | 'Bug'
  | 'Billing'
  | 'Account'
  | 'Integrations'
  | 'Performance'
  | 'Feature request'
  | 'Other'

export type MessageKind = 'public' | 'internal' | 'system'

export interface TicketPerson {
  id: string
  name: string
  email?: string
  role?: 'customer' | 'agent' | 'admin'
}

export interface TicketMessage {
  id: string
  kind: MessageKind
  author: TicketPerson
  body: string
  createdAt: string
}

/** Customer-facing controls on ticket detail. */
export interface CustomerTicketPermissions {
  canReply: boolean
  canEdit: boolean
  editDisabledReason: string | null
  canClose: boolean
  canReopen: boolean
}

/** Staff-facing controls on ticket detail. */
export interface StaffTicketPermissions {
  canReply: boolean
  canInternalNote: boolean
  canChangeStatus: boolean
  canChangePriority: boolean
  canAssign: boolean
  canDelete: boolean
}

export type TicketPermissions = CustomerTicketPermissions | StaffTicketPermissions

/** Full ticket detail returned by GET/POST/PATCH ticket mutations. */
export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory | null
  createdAt: string
  updatedAt: string
  assignee: TicketPerson | null
  messages: TicketMessage[]
  permissions: TicketPermissions
  /** Staff detail only */
  requester?: TicketPerson
  version?: number
  lastActivityAt?: string
}

/** Customer list item from GET /tickets. */
export interface TicketListItem {
  id: number
  title: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory | null
  replyCount: number
  createdAt: string
  updatedAt: string
}

export interface TicketsQueryParams {
  status?: TicketStatus | 'all'
  sort?: 'asc' | 'desc'
  page?: number
  limit?: number
  /** Sent to the API as `q`. */
  search?: string
}

/** Strict body for POST /tickets — never send priority or other unknown keys. */
export interface CreateTicketPayload {
  title: string
  description: string
  category?: TicketCategory
}
