import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage, getExtra, isConflict } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import type { QueueItem } from '@/features/queue/types/queue.types'

import { updateTicketPriority } from '../api/ticketsApi'
import type { TicketPriority } from '../types/ticket.types'

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

      // Handle version conflict
      if (isConflict(error)) {
        const currentVersion = getExtra<number>(error, 'currentVersion')
        if (currentVersion !== undefined) {
          toast.error('Someone else just updated this ticket. The page will refresh with the latest version.')
        } else {
          toast.error('This ticket was just modified by someone else. Please try again.')
        }
        // Refetch to get the latest data
        queryClient.invalidateQueries({ queryKey: ['queue'] })
      } else {
        toast.error(getErrorMessage(error, 'Failed to update priority. Please try again.'))
      }
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
