import { useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { AddStaffUserDialog } from '../components/AddStaffUserDialog'
import { ChangeRoleDialog } from '../components/ChangeRoleDialog'
import { DeactivateUserDialog } from '../components/DeactivateUserDialog'
import { UserCreatedDialog } from '../components/UserCreatedDialog'
import { UsersHeader } from '../components/UsersHeader'
import { UsersEmptyState, UsersTable } from '../components/UsersTable'
import { UsersToolbar } from '../components/UsersToolbar'
import { useUpdateUserStatus } from '../hooks/useUpdateUserStatus'
import { useUserFilters } from '../hooks/useUserFilters'
import { useUsers } from '../hooks/useUsers'
import type { AdminUser, CreateUserResponse } from '../types/user.types'

export default function UsersPage() {
  const filters = useUserFilters()
  const { data, isLoading, error } = useUsers(filters.params)
  const updateStatus = useUpdateUserStatus()
  const [addStaffOpen, setAddStaffOpen] = useState(false)
  const [createdUser, setCreatedUser] = useState<CreateUserResponse | null>(null)
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null)
  const [deactivateUser, setDeactivateUser] = useState<AdminUser | null>(null)

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const userCount = data?.meta.total ?? 0
  const hasFilters = Boolean(filters.debouncedSearch) || filters.role !== 'all' || filters.status !== 'all'

  // Sessions / force sign-out dialogs land in the next Step 5 batch.
  const stubAction = (_user: AdminUser) => undefined

  const handleToggleStatus = (user: AdminUser) => {
    if (user.active) {
      setDeactivateUser(user)
      return
    }

    updateStatus.mutate(
      { userId: user.id, active: true },
      {
        onSuccess: () => toast.success(`${user.name} was activated.`),
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to activate user. Please try again.')),
      },
    )
  }

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
            <UsersEmptyState hasFilters={hasFilters} onClearFilters={filters.clearFilters} />
          ) : (
            <UsersTable
              users={data.data}
              onChangeRole={setRoleUser}
              onViewSessions={stubAction}
              onForceSignOut={stubAction}
              onToggleStatus={handleToggleStatus}
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

      <AddStaffUserDialog
        open={addStaffOpen}
        onOpenChange={setAddStaffOpen}
        onCreated={(response) => {
          setAddStaffOpen(false)
          setCreatedUser(response)
        }}
      />

      <UserCreatedDialog
        open={createdUser !== null}
        response={createdUser}
        onOpenChange={(open) => {
          if (!open) setCreatedUser(null)
        }}
      />

      <ChangeRoleDialog
        user={roleUser}
        open={roleUser !== null}
        onOpenChange={(open) => {
          if (!open) setRoleUser(null)
        }}
      />

      <DeactivateUserDialog
        user={deactivateUser}
        open={deactivateUser !== null}
        onOpenChange={(open) => {
          if (!open) setDeactivateUser(null)
        }}
      />
    </section>
  )
}
