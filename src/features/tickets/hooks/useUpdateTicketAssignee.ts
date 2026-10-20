import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage, getExtra, isConflict } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { QueueItem } from '@/features/queue/types/queue.types'

import { updateTicketAssignee } from '../api/ticketsApi'

export function useUpdateTicketAssignee() {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: ({
      ticketId,
      assigneeId,
      expectedAssigneeId = null,
    }: {
      ticketId: number
      assigneeId: string
      expectedAssigneeId?: string | null
    }) => {
      return updateTicketAssignee(ticketId, assigneeId, expectedAssigneeId)
    },
    onMutate: async ({ ticketId, assigneeId }) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] })

      const previousData = queryClient.getQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] })

      // Optimistically update the assignee
      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  assignee: { id: assigneeId, name: '' }, // Name will be updated on success
                  updatedAt: new Date().toISOString(),
                }
              : ticket,
          ),
        }
      })

      // Optimistically update "My assigned" count only if assigning to current user
      if (currentUser && assigneeId === currentUser.id) {
        queryClient.setQueriesData<PaginatedResponse<QueueItem>>(
          { queryKey: ['queue', { page: 1, limit: 1, assignee: currentUser.id }] },
          (old) => {
            if (!old) return old
            return {
              ...old,
              meta: {
                ...old.meta,
                total: old.meta.total + 1,
              },
            }
          },
        )
      }

      return { previousData }
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      // Handle assignee conflict (409 ASSIGNEE_CONFLICT)
      if (isConflict(error)) {
        const assigneeName = getExtra<string>(error, 'currentAssigneeName')
        if (assigneeName) {
          toast.error(`${assigneeName} just took this ticket.`)
        } else {
          toast.error('Someone else just changed the assignee. Please try again.')
        }
        // Refetch to get the latest data
        queryClient.invalidateQueries({ queryKey: ['queue'] })
        queryClient.invalidateQueries({ queryKey: ['queue-count'] })
      } else {
        toast.error(getErrorMessage(error, 'Failed to assign ticket. Please try again.'))
      }
    },
    onSuccess: (updatedTicket, { assigneeId }) => {
      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === updatedTicket.id
              ? {
                  ...ticket,
                  assignee: updatedTicket.assignee,
                  updatedAt: updatedTicket.updatedAt,
                  lastActivityAt: updatedTicket.lastActivityAt ?? updatedTicket.updatedAt,
                }
              : ticket,
          ),
        }
      })

      // Invalidate queue counts to update sidebar badges
      queryClient.invalidateQueries({ queryKey: ['queue-count'] })

      // Show success message only if assigning to current user
      if (currentUser && assigneeId === currentUser.id) {
        toast.success('Ticket assigned to you')
      } else {
        toast.success('Ticket assigned')
      }
    },
  })
}
