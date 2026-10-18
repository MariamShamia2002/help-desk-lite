import { apiClient, apiClientPaginated } from '@/api/client'
import type { PaginatedResponse } from '@/api/types'

import type { QueueItem, QueueQueryParams, StaffAgent } from '../types/queue.types'

export async function fetchQueue(params: QueueQueryParams): Promise<PaginatedResponse<QueueItem>> {
  const searchParams = new URLSearchParams()

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status)
  }
  if (params.priority && params.priority !== 'all') {
    searchParams.set('priority', params.priority)
  }
  if (params.assignee && params.assignee !== 'all') {
    searchParams.set('assignee', params.assignee)
  }
  if (params.sort) {
    searchParams.set('sort', params.sort)
  }
  if (params.page) {
    searchParams.set('page', params.page.toString())
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString())
  }
  if (params.search) {
    searchParams.set('q', params.search)
  }

  const query = searchParams.toString()
  const endpoint = query ? `/queue?${query}` : '/queue'

  return apiClientPaginated<QueueItem>(endpoint)
}

export function fetchStaffAgents(): Promise<StaffAgent[]> {
  return apiClient<StaffAgent[]>('/staff/agents')
}
