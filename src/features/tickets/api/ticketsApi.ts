import { apiClient, apiClientPaginated } from '@/api/client'
import type { PaginatedResponse } from '@/api/types'

import type {
  CreateTicketPayload,
  CreateTicketResponse,
  TicketListItem,
  TicketsQueryParams,
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
    searchParams.set('search', params.search)
  }

  const query = searchParams.toString()
  const endpoint = query ? `/tickets?${query}` : '/tickets'

  return apiClientPaginated<TicketListItem>(endpoint)
}

export async function createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
  return apiClient<CreateTicketResponse>('/tickets', {
    method: 'POST',
    body: payload,
  })
}
