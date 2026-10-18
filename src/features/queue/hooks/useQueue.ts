import { useQuery } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { fetchQueue } from '../api/queueApi'
import type { QueueItem, QueueQueryParams } from '../types/queue.types'

export function useQueue(params: QueueQueryParams) {
  return useQuery<PaginatedResponse<QueueItem>>({
    queryKey: ['queue', params],
    queryFn: () => fetchQueue(params),
  })
}
