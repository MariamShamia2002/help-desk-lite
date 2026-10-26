import { LogOut, Monitor, MoreHorizontal, Power, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { AdminUser } from '../types/user.types'

interface UserRowActionsProps {
  user: AdminUser
  onChangeRole: (user: AdminUser) => void
  onViewSessions: (user: AdminUser) => void
  onForceSignOut: (user: AdminUser) => void
  onToggleStatus: (user: AdminUser) => void
}

export function UserRowActions({
  user,
  onChangeRole,
  onViewSessions,
  onForceSignOut,
  onToggleStatus,
}: UserRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu for {user.name}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onChangeRole(user)}>
          <Shield className="size-4" />
          <span>Change role</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onViewSessions(user)}>
          <Monitor className="size-4" />
          <span>View sessions</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onForceSignOut(user)}>
          <LogOut className="size-4" />
          <span>Force sign-out</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant={user.active ? 'destructive' : 'default'}
          className="flex items-center gap-2"
          onClick={() => onToggleStatus(user)}
        >
          <Power className="size-4" />
          <span>{user.active ? 'Deactivate' : 'Activate'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
