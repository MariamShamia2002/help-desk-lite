import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { fetchTickets } from '../api/ticketsApi'
import type { TicketListItem, TicketsQueryParams } from '../types/ticket.types'

type TicketsQueryOptions = Pick<
  UseQueryOptions<PaginatedResponse<TicketListItem>>,
  'enabled'
>

export function useTickets(params: TicketsQueryParams, options?: TicketsQueryOptions) {
  return useQuery<PaginatedResponse<TicketListItem>>({
    queryKey: ['tickets', params],
    queryFn: () => fetchTickets(params),
    ...options,
  })
}
