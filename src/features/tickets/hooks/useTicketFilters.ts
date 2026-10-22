import { useEffect, useState } from 'react'

import type { TicketStatus, TicketsQueryParams } from '../types/ticket.types'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

export function useTicketFilters() {
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
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

  const params: TicketsQueryParams = {
    status,
    sort,
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  }

  const selectStatus = (next: TicketStatus | 'all') => {
    setStatus(next)
    setPage(1)
  }

  const selectSort = (next: 'asc' | 'desc') => {
    setSort(next)
    setPage(1)
  }

  return {
    status,
    sort,
    page,
    search,
    debouncedSearch,
    params,
    setSearch,
    setPage,
    selectStatus,
    selectSort,
  }
}
