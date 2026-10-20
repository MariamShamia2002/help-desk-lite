import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import type { TicketStatus } from '@/features/tickets/types/ticket.types'

import { updateTicketStatus } from '../api/queueApi'
import type { QueueItem } from '../types/queue.types'

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: number; status: TicketStatus }) =>
      updateTicketStatus(ticketId, status),
    onMutate: async ({ ticketId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] })

      const previousData = queryClient.getQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] })

      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket,
          ),
        }
      })

      return { previousData }
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(getErrorMessage(error, 'Failed to update status. Please try again.'))
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === updatedTicket.id
              ? {
                  ...ticket,
                  status: updatedTicket.status,
                  updatedAt: updatedTicket.updatedAt,
                  lastActivityAt: updatedTicket.lastActivityAt ?? updatedTicket.updatedAt,
                }
              : ticket,
          ),
        }
      })
    },
  })
}
