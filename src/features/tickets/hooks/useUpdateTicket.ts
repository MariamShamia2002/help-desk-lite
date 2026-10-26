import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage, getFieldErrors, hasCode, isApiError } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import type { QueueItem } from '@/features/queue/types/queue.types'

import { updateTicket } from '../api/ticketsApi'
import type { TicketListItem, UpdateTicketPayload } from '../types/ticket.types'
import { ticketQueryKey } from './useTicket'

interface UpdateTicketVariables {
  ticketId: number
  payload: UpdateTicketPayload
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, payload }: UpdateTicketVariables) => updateTicket(ticketId, payload),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(ticketQueryKey(updatedTicket.id), updatedTicket)

      queryClient.setQueriesData<PaginatedResponse<TicketListItem>>({ queryKey: ['tickets'] }, (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === updatedTicket.id
              ? { ...ticket, title: updatedTicket.title, updatedAt: updatedTicket.updatedAt }
              : ticket,
          ),
        }
      })

      queryClient.setQueriesData<PaginatedResponse<QueueItem>>({ queryKey: ['queue'] }, (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((ticket) =>
            ticket.id === updatedTicket.id
              ? { ...ticket, title: updatedTicket.title, updatedAt: updatedTicket.updatedAt }
              : ticket,
          ),
        }
      })
    },
    onError: (error, { ticketId }) => {
      if (hasCode(error, 'TICKET_NOT_EDITABLE')) {
        toast.error(getErrorMessage(error, 'This ticket can no longer be edited.'))
        void queryClient.invalidateQueries({ queryKey: ticketQueryKey(ticketId) })
        return
      }

      if (isApiError(error) && error.status === 403) {
        toast.error(getErrorMessage(error, 'You cannot edit this ticket.'))
        void queryClient.invalidateQueries({ queryKey: ticketQueryKey(ticketId) })
        return
      }

      if (Object.keys(getFieldErrors(error)).length > 0) return

      toast.error(getErrorMessage(error, 'Failed to update ticket. Please try again.'))
    },
  })
}
