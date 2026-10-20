import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import type { TicketPriority } from '@/features/tickets/types/ticket.types'

import { updateTicketPriority } from '../api/queueApi'
import type { QueueItem } from '../types/queue.types'

export function useUpdateTicketPriority() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, priority }: { ticketId: number; priority: TicketPriority }) =>
      updateTicketPriority(ticketId, priority),
    onMutate: async ({ ticketId, priority }) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] })

      const previousData = queryClient.getQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] })

      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, priority, updatedAt: new Date().toISOString() } : ticket,
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
      toast.error(getErrorMessage(error, 'Failed to update priority. Please try again.'))
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
                  priority: updatedTicket.priority,
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
