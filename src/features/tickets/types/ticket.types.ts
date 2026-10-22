import type { Role } from '@/api/types'
export type TicketStatus = 'open' | 'progress' | 'waiting' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

/** Exact enum values from the API contract. */
export type TicketCategory =
  'Bug' | 'Billing' | 'Account' | 'Integrations' | 'Performance' | 'Feature request' | 'Other'

export type MessageKind = 'public' | 'internal' | 'system'

export interface TicketPerson {
  id: string
  name: string
  email?: string
  role?: Role
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

export function isStaffTicketPermissions(permissions: TicketPermissions): permissions is StaffTicketPermissions {
  return 'canAssign' in permissions
}

export function isCustomerTicketPermissions(permissions: TicketPermissions): permissions is CustomerTicketPermissions {
  return 'canEdit' in permissions
}

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

/** Strict body for PATCH /tickets/:id. Send only the fields that changed. */
export interface UpdateTicketPayload {
  title?: string
  description?: string
}

/** Strict body for POST /tickets/:id/messages. System messages are created by the server. */
export interface CreateMessagePayload {
  kind: 'public' | 'internal'
  body: string
}
