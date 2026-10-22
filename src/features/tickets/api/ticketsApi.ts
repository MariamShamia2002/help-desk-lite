import { apiClient, apiClientPaginated } from '@/api/client'
import type { PaginatedResponse } from '@/api/types'

import type {
  CreateMessagePayload,
  CreateTicketPayload,
  Ticket,
  TicketListItem,
  TicketMessage,
  TicketsQueryParams,
  UpdateTicketPayload,
} from '../types/ticket.types'

export async function fetchTickets(params: TicketsQueryParams): Promise<PaginatedResponse<TicketListItem>> {
  const searchParams = new URLSearchParams()

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status)
  }
  if (params.sort) {
    searchParams.set('sort', params.sort)
  }
  if (params.page) {
    searchParams.set('page', params.page.toString())
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString())
  }
  if (params.search) {
    searchParams.set('q', params.search)
  }

  const query = searchParams.toString()
  const endpoint = query ? `/tickets?${query}` : '/tickets'

  return apiClientPaginated<TicketListItem>(endpoint)
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const body: CreateTicketPayload = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    ...(payload.category ? { category: payload.category } : {}),
  }

  return apiClient<Ticket>('/tickets', {
    method: 'POST',
    body,
  })
}

export function fetchTicket(ticketId: number): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}`)
}

export async function updateTicket(ticketId: number, payload: UpdateTicketPayload): Promise<Ticket> {
  const body: UpdateTicketPayload = {}
  if (payload.title !== undefined) body.title = payload.title.trim()
  if (payload.description !== undefined) body.description = payload.description.trim()

  return apiClient<Ticket>(`/tickets/${ticketId}`, {
    method: 'PATCH',
    body,
  })
}

export async function createTicketMessage(ticketId: number, payload: CreateMessagePayload): Promise<TicketMessage> {
  return apiClient<TicketMessage>(`/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: {
      kind: payload.kind,
      body: payload.body.trim(),
    },
  })
}

export async function updateTicketStatus(
  ticketId: number,
  status: Ticket['status'],
  expectedVersion?: number,
): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}/status`, {
    method: 'PATCH',
    body: {
      status,
      ...(typeof expectedVersion === 'number' ? { expectedVersion } : {}),
    },
  })
}

export async function updateTicketPriority(
  ticketId: number,
  priority: Ticket['priority'],
  expectedVersion?: number,
): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}/priority`, {
    method: 'PATCH',
    body: {
      priority,
      ...(typeof expectedVersion === 'number' ? { expectedVersion } : {}),
    },
  })
}

export function deleteTicket(ticketId: number): Promise<void> {
  return apiClient<void>(`/tickets/${ticketId}`, { method: 'DELETE' })
}

export async function updateTicketAssignee(
  ticketId: number,
  assigneeId: string | null,
  expectedAssigneeId: string | null,
): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}/assignee`, {
    method: 'PATCH',
    body: { assigneeId, expectedAssigneeId },
  })
}
