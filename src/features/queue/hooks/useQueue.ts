import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'

import { fetchQueue } from '../api/queueApi'
import type { QueueItem, QueueQueryParams } from '../types/queue.types'

export function useQueue(
  params: QueueQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<QueueItem>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<PaginatedResponse<QueueItem>>({
    ...options,
    queryKey: ['queue', params],
    queryFn: () => fetchQueue(params),
   
  })
}
