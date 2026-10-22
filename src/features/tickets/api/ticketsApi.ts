import { apiClient, apiClientPaginated } from '@/api/client'
import type { PaginatedResponse } from '@/api/types'

import type { CreateTicketPayload, Ticket, TicketListItem, TicketsQueryParams } from '../types/ticket.types'

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

export async function updateTicketStatus(ticketId: number, status: Ticket['status']): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export async function updateTicketPriority(ticketId: number, priority: Ticket['priority']): Promise<Ticket> {
  return apiClient<Ticket>(`/tickets/${ticketId}/priority`, {
    method: 'PATCH',
    body: { priority },
  })
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
