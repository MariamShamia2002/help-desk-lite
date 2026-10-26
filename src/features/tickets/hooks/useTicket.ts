import { useQuery } from '@tanstack/react-query'

import { fetchTicket } from '../api/ticketsApi'
import type { Ticket } from '../types/ticket.types'

export const ticketQueryKey = (ticketId: number) => ['ticket', ticketId] as const

export function useTicket(ticketId: number) {
  return useQuery<Ticket>({
    queryKey: ticketQueryKey(ticketId),
    queryFn: () => fetchTicket(ticketId),
    enabled: Number.isInteger(ticketId) && ticketId > 0,
  })
}
