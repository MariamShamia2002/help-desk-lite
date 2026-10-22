import { useQuery } from '@tanstack/react-query'

import { fetchStaffAgents } from '../api/queueApi'
import type { StaffAgent } from '../types/queue.types'

export function useStaffAgents(enabled = true) {
  return useQuery<StaffAgent[]>({
    queryKey: ['staff', 'agents'],
    queryFn: fetchStaffAgents,
    enabled,
  })
}
