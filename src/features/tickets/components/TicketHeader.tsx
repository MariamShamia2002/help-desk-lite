import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { MoreHorizontal } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { useDeleteTicket } from '../hooks/useDeleteTicket'
import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus'
import { getPriorityColor, getPriorityLabel, getStatusColor, getStatusLabel } from '../lib/ticketHelpers'
import {
  isCustomerTicketPermissions,
  isStaffTicketPermissions,
  type Ticket,
  type TicketStatus,
} from '../types/ticket.types'

interface TicketHeaderProps {
  ticket: Ticket
  onEdit: () => void
}

function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TicketHeader({ ticket, onEdit }: TicketHeaderProps) {
  const navigate = useNavigate()
  const capabilities = useAuthStore((state) => state.capabilities)
  const updateStatus = useUpdateTicketStatus()
  const deleteTicket = useDeleteTicket()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const back = hasCapability(capabilities, 'queue:view')
    ? { to: '/queue', label: 'Queue' }
    : { to: '/tickets', label: 'My tickets' }
  const staffPermissions = isStaffTicketPermissions(ticket.permissions) ? ticket.permissions : null
  const customerPermissions = staffPermissions
    ? null
    : isCustomerTicketPermissions(ticket.permissions)
      ? ticket.permissions
      : null
  const editDisabledReason = customerPermissions?.editDisabledReason?.trim() ?? ''
  const showClose = Boolean(
    customerPermissions?.canClose || (staffPermissions?.canChangeStatus && ticket.status !== 'closed'),
  )
  const showReopen = Boolean(customerPermissions?.canReopen)
  const showDelete = Boolean(staffPermissions?.canDelete)

  const changeStatus = (status: TicketStatus) => {
    updateStatus.mutate({
      ticketId: ticket.id,
      status,
      ...(typeof ticket.version === 'number' ? { expectedVersion: ticket.version } : {}),
    })
  }

  const confirmDelete = async () => {
    try {
      await deleteTicket.mutateAsync(ticket.id)
      navigate(back.to)
    } catch {
      // The hook already shows the error.
    }
  }

  const details = [
    ticket.requester ? `Opened by ${ticket.requester.name}` : null,
    `Created ${formatWhen(ticket.createdAt)}`,
    `Updated ${formatWhen(ticket.updatedAt)}`,
    ticket.assignee ? `Assigned to ${ticket.assignee.name}` : 'Unassigned',
  ].filter((part): part is string => Boolean(part))

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={back.to} className="text-sm text-muted-foreground hover:text-foreground">
          ← {back.label}
        </Link>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {(customerPermissions?.canEdit || editDisabledReason) && (
            <span
              className="inline-flex"
              title={!customerPermissions?.canEdit ? editDisabledReason : undefined}
            >
              <Button type="button" disabled={!customerPermissions?.canEdit} onClick={onEdit}>
                Edit
              </Button>
            </span>
          )}
          {showReopen && (
            <Button
              type="button"
              variant="outline"
              disabled={updateStatus.isPending}
              onClick={() => changeStatus('open')}
            >
              Reopen ticket
            </Button>
          )}
          {showClose && (
            <Button
              type="button"
              variant="outline"
              disabled={updateStatus.isPending}
              onClick={() => changeStatus('closed')}
            >
              Close ticket
            </Button>
          )}
          {showDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="size-8 p-0">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Ticket actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  Delete ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-muted-foreground">#{ticket.id}</span>
        <Badge variant={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
        {customerPermissions && (
          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
            {getPriorityLabel(ticket.priority)}
          </Badge>
        )}
      </div>
      <h1 className="font-heading text-2xl font-semibold text-balance">{ticket.title}</h1>
      <p className="text-sm text-muted-foreground">{details.join(' · ')}</p>

      <AlertDialog open={deleteOpen} onOpenChange={(next) => !deleteTicket.isPending && setDeleteOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ticket #{ticket.id}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes the ticket and its conversation.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTicket.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteTicket.isPending}
              onClick={() => void confirmDelete()}
            >
              {deleteTicket.isPending ? 'Deleting...' : 'Delete ticket'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
