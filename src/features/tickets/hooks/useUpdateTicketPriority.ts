import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage, getExtra, isConflict } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import type { QueueItem } from '@/features/queue/types/queue.types'

import { updateTicketPriority } from '../api/ticketsApi'
import type { TicketListItem, TicketPriority } from '../types/ticket.types'
import { ticketQueryKey } from './useTicket'

interface UpdateTicketPriorityVariables {
  ticketId: number
  priority: TicketPriority
  expectedVersion?: number
}

export function useUpdateTicketPriority() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, priority, expectedVersion }: UpdateTicketPriorityVariables) =>
      updateTicketPriority(ticketId, priority, expectedVersion),
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
    onError: (error, { ticketId }, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      if (isConflict(error)) {
        const currentVersion = getExtra<number>(error, 'currentVersion')
        if (currentVersion !== undefined) {
          toast.error('Someone else just updated this ticket. The page will refresh with the latest version.')
        } else {
          toast.error('This ticket was just modified by someone else. Please try again.')
        }
        void queryClient.invalidateQueries({ queryKey: ['queue'] })
        void queryClient.invalidateQueries({ queryKey: ticketQueryKey(ticketId) })
        return
      }

      toast.error(getErrorMessage(error, 'Failed to update priority. Please try again.'))
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(ticketQueryKey(updatedTicket.id), updatedTicket)

      queryClient.setQueriesData<PaginatedResponse<TicketListItem>>({ queryKey: ['tickets'] }, (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === updatedTicket.id
              ? { ...ticket, priority: updatedTicket.priority, updatedAt: updatedTicket.updatedAt }
              : ticket,
          ),
        }
      })

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
