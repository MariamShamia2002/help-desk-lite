import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage, getFieldErrors, hasCode } from '@/api/errors'

import { createTicketMessage } from '../api/ticketsApi'
import type { CreateMessagePayload, Ticket } from '../types/ticket.types'
import { ticketQueryKey } from './useTicket'

interface CreateTicketMessageVariables {
  ticketId: number
  payload: CreateMessagePayload
}

export function useCreateTicketMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, payload }: CreateTicketMessageVariables) => createTicketMessage(ticketId, payload),
    onSuccess: (message, { ticketId }) => {
      queryClient.setQueryData<Ticket>(ticketQueryKey(ticketId), (current) => {
        if (!current) return current
        if (current.messages.some((item) => item.id === message.id)) return current
        return { ...current, messages: [...current.messages, message] }
      })

      void queryClient.invalidateQueries({ queryKey: ['tickets'] })
      void queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
    onError: (error, { ticketId }) => {
      if (hasCode(error, 'TICKET_CLOSED')) {
        toast.error(getErrorMessage(error, 'This ticket is closed.'))
        void queryClient.invalidateQueries({ queryKey: ticketQueryKey(ticketId) })
        return
      }

      if (Object.keys(getFieldErrors(error)).length > 0) return

      toast.error(getErrorMessage(error, 'Failed to send message. Please try again.'))
    },
  })
}
