import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'

import { deleteTicket } from '../api/ticketsApi'
import { ticketQueryKey } from './useTicket'

export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketId: number) => deleteTicket(ticketId),
    onSuccess: (_result, ticketId) => {
      queryClient.removeQueries({ queryKey: ticketQueryKey(ticketId) })
      void queryClient.invalidateQueries({ queryKey: ['tickets'] })
      void queryClient.invalidateQueries({ queryKey: ['queue'] })
      toast.success('Ticket deleted')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete ticket. Please try again.'))
    },
  })
}
