import { useEffect, useState } from 'react'

import type { UserRoleFilter, UsersQueryParams, UserStatusFilter } from '../types/user.types'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

export function useUserFilters() {
  const [role, setRole] = useState<UserRoleFilter>('all')
  const [status, setStatus] = useState<UserStatusFilter>('all')
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

  const params: UsersQueryParams = {
    role,
    status,
    page,
    limit: PAGE_SIZE,
    q: debouncedSearch || undefined,
  }

  const selectRole = (next: UserRoleFilter) => {
    setRole(next)
    setPage(1)
  }

  const selectStatus = (next: UserStatusFilter) => {
    setStatus(next)
    setPage(1)
  }

  const clearFilters = () => {
    setRole('all')
    setStatus('all')
    setSearch('')
    setDebouncedSearch('')
    setPage(1)
  }

  return {
    role,
    status,
    page,
    search,
    debouncedSearch,
    params,
    setSearch,
    setPage,
    selectRole,
    selectStatus,
    clearFilters,
  }
}
