import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { FilterSelect } from '@/features/queue/components/FilterSelect'

import { USER_ROLE_FILTERS, USER_STATUS_FILTERS } from '../lib/userHelpers'
import type { UserRoleFilter, UserStatusFilter } from '../types/user.types'

interface UsersToolbarProps {
  search: string
  role: UserRoleFilter
  status: UserStatusFilter
  onSearchChange: (value: string) => void
  onRoleChange: (role: UserRoleFilter) => void
  onStatusChange: (status: UserStatusFilter) => void
}

export function UsersToolbar({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1 basis-48 sm:max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search by name or email"
          className="pl-9"
        />
      </div>

      <FilterSelect
        label="Role"
        value={role}
        onChange={(value) => onRoleChange(value as UserRoleFilter)}
        options={USER_ROLE_FILTERS.map((option) => ({ label: option.label, value: option.value }))}
        prefix="Role"
      />

      <FilterSelect
        label="Status"
        value={status}
        onChange={(value) => onStatusChange(value as UserStatusFilter)}
        options={USER_STATUS_FILTERS.map((option) => ({ label: option.label, value: option.value }))}
        prefix="Status"
      />
    </div>
  )
}
