import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { useTickets } from './useTickets'

export function useTicketCounts() {
  const capabilities = useAuthStore((state) => state.capabilities)
  const canViewOwn = hasCapability(capabilities, 'tickets:view-own')

  const { data } = useTickets({ status: 'all', sort: 'desc', page: 1, limit: 1 }, { enabled: canViewOwn })

  return {
    ticketCount: data?.meta.total,
  }
}
