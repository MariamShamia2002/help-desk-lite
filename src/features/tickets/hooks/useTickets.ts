import { useQuery } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { fetchTickets } from '../api/ticketsApi'
import type { TicketListItem, TicketsQueryParams } from '../types/ticket.types'

export function useTickets(params: TicketsQueryParams) {
  return useQuery<PaginatedResponse<TicketListItem>>({
    queryKey: ['tickets', params],
    queryFn: () => fetchTickets(params),
  })
}
