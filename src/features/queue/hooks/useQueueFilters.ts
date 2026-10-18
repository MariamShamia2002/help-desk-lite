import { useEffect, useState } from 'react'

import type { TicketPriority, TicketStatus } from '@/features/tickets/types/ticket.types'

import type { QueueAssignee, QueueQueryParams } from '../types/queue.types'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

export function useQueueFilters(lockedAssignee?: 'me') {
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all')
  const [assignee, setAssignee] = useState<QueueAssignee>('all')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search])

  const params: QueueQueryParams = {
    status,
    priority,
    assignee: lockedAssignee ?? assignee,
    sort,
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  }

  const selectStatus = (next: TicketStatus | 'all') => {
    setStatus(next)
    setPage(1)
  }

  const selectPriority = (next: TicketPriority | 'all') => {
    setPriority(next)
    setPage(1)
  }

  const selectAssignee = (next: QueueAssignee) => {
    setAssignee(next)
    setPage(1)
  }

  const selectSort = (next: 'asc' | 'desc') => {
    setSort(next)
    setPage(1)
  }

  return {
    status,
    priority,
    assignee: lockedAssignee ?? assignee,
    sort,
    page,
    search,
    debouncedSearch,
    showAssigneeFilter: lockedAssignee === undefined,
    params,
    setSearch,
    setPage,
    selectStatus,
    selectPriority,
    selectAssignee,
    selectSort,
  }
}
