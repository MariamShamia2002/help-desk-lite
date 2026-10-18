import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { createTicket } from '../api/ticketsApi'
import type { CreateTicketPayload, Ticket, TicketListItem } from '../types/ticket.types'

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation<Ticket, Error, CreateTicketPayload>({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      queryClient.setQueriesData<PaginatedResponse<TicketListItem>>({ queryKey: ['tickets'] }, (oldData) => {
        if (!oldData) return oldData

        const newListItem: TicketListItem = {
          id: newTicket.id,
          title: newTicket.title,
          status: newTicket.status,
          priority: newTicket.priority,
          category: newTicket.category,
          replyCount: 0,
          createdAt: newTicket.createdAt,
          updatedAt: newTicket.updatedAt,
        }

        return {
          data: [newListItem, ...oldData.data.filter((ticket) => ticket.id !== newTicket.id)],
          meta: {
            ...oldData.meta,
            total: oldData.meta.total + 1,
          },
        }
      })
    },
  })
}
