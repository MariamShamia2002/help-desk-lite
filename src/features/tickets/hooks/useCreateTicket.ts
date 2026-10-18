import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { createTicket } from '../api/ticketsApi'
import type { CreateTicketPayload, CreateTicketResponse, TicketListItem } from '../types/ticket.types'

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation<CreateTicketResponse, Error, CreateTicketPayload>({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      // Update all ticket list queries by prepending the new ticket to the data
      queryClient.setQueriesData<PaginatedResponse<TicketListItem>>(
        { queryKey: ['tickets'] },
        (oldData) => {
          if (!oldData) return oldData

          const newListItem: TicketListItem = {
            id: newTicket.id,
            title: newTicket.title,
            status: newTicket.status,
            priority: 'normal',
            replyCount: 0,
            createdAt: newTicket.createdAt,
            updatedAt: newTicket.createdAt,
          }

          return {
            data: [newListItem, ...oldData.data],
            meta: {
              ...oldData.meta,
              total: oldData.meta.total + 1,
            },
          }
        },
      )
    },
  })
}
