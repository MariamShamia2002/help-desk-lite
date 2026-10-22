import { Button } from '@/components/ui/button'

import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus'
import { isCustomerTicketPermissions, isStaffTicketPermissions, type Ticket } from '../types/ticket.types'
import { CustomerReplyComposer } from './CustomerReplyComposer'
import { StaffReplyComposer } from './StaffReplyComposer'

interface ReplyComposerProps {
  ticket: Ticket
}

export function ReplyComposer({ ticket }: ReplyComposerProps) {
  const updateStatus = useUpdateTicketStatus()
  const staffPermissions = isStaffTicketPermissions(ticket.permissions) ? ticket.permissions : null
  const customerPermissions = staffPermissions
    ? null
    : isCustomerTicketPermissions(ticket.permissions)
      ? ticket.permissions
      : null

  if (ticket.status === 'closed') {
    const canReopen = customerPermissions ? customerPermissions.canReopen : Boolean(staffPermissions?.canChangeStatus)

    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">This ticket is closed. Reopen it to reply.</p>
        {canReopen && (
          <Button
            type="button"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate({
                ticketId: ticket.id,
                status: 'open',
                ...(typeof ticket.version === 'number' ? { expectedVersion: ticket.version } : {}),
              })
            }
          >
            {updateStatus.isPending ? 'Reopening...' : 'Reopen to reply'}
          </Button>
        )}
      </div>
    )
  }

  if (staffPermissions) {
    return <StaffReplyComposer ticket={ticket} permissions={staffPermissions} />
  }

  return <CustomerReplyComposer ticket={ticket} canReply={Boolean(customerPermissions?.canReply)} />
}
