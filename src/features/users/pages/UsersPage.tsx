import { useState } from 'react'

import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { UsersHeader } from '../components/UsersHeader'
import { UsersEmptyState, UsersTable } from '../components/UsersTable'
import { UsersToolbar } from '../components/UsersToolbar'
import { useUserFilters } from '../hooks/useUserFilters'
import { useUsers } from '../hooks/useUsers'
import type { AdminUser } from '../types/user.types'

export default function UsersPage() {
  const filters = useUserFilters()
  const { data, isLoading, error } = useUsers(filters.params)
  // Dialog open state is wired in Step 4 (AddStaffUserDialog).
  const [, setAddStaffOpen] = useState(false)

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const userCount = data?.meta.total ?? 0
  const hasFilters = Boolean(filters.debouncedSearch) || filters.role !== 'all' || filters.status !== 'all'

  // Row-action dialogs are wired in Step 5.
  const stubAction = (_user: AdminUser) => undefined

  return (
    <section className="flex flex-col gap-6">
      <UsersHeader userCount={userCount} onAddStaffUser={() => setAddStaffOpen(true)} />

      <UsersToolbar
        search={filters.search}
        role={filters.role}
        status={filters.status}
        onSearchChange={filters.setSearch}
        onRoleChange={filters.selectRole}
        onStatusChange={filters.selectStatus}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(error, 'Failed to load users. Please try again.')}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading users...</div>
      )}

      {!isLoading && data && (
        <>
          {data.data.length === 0 ? (
            <UsersEmptyState hasFilters={hasFilters} />
          ) : (
            <UsersTable
              users={data.data}
              onChangeRole={stubAction}
              onViewSessions={stubAction}
              onForceSignOut={stubAction}
              onToggleStatus={stubAction}
            />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={filters.page === 1} onClick={() => filters.setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => filters.setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
