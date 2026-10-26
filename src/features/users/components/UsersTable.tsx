import { UserAvatar } from '@/components/shared/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { formatUserLastActive, getActiveBadgeVariant, getActiveLabel, getRoleLabel } from '../lib/userHelpers'
import type { AdminUser } from '../types/user.types'

import { UserRowActions } from './UserRowActions'

interface UsersTableProps {
  users: AdminUser[]
  onChangeRole: (user: AdminUser) => void
  onViewSessions: (user: AdminUser) => void
  onForceSignOut: (user: AdminUser) => void
  onToggleStatus: (user: AdminUser) => void
}

interface UsersEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function UsersEmptyState({ hasFilters, onClearFilters }: UsersEmptyStateProps) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        {hasFilters ? 'No users match your filters.' : 'No users yet.'}
      </p>
      {hasFilters && (
        <Button type="button" variant="outline" className="mt-4" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  )
}

export function UsersTable({
  users,
  onChangeRole,
  onViewSessions,
  onForceSignOut,
  onToggleStatus,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-32">Role</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-40">Last active</TableHead>
            <TableHead className="w-24 text-center">Tickets</TableHead>
            <TableHead className="w-14">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getActiveBadgeVariant(user.active)}>{getActiveLabel(user.active)}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatUserLastActive(user.lastActiveAt)}
              </TableCell>
              <TableCell className="text-center">{user.ticketsCount}</TableCell>
              <TableCell>
                <UserRowActions
                  user={user}
                  onChangeRole={onChangeRole}
                  onViewSessions={onViewSessions}
                  onForceSignOut={onForceSignOut}
                  onToggleStatus={onToggleStatus}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
