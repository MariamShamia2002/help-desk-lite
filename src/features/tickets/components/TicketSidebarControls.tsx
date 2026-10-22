import { ArrowDown, ArrowUp, Circle, Clock, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useStaffAgents } from '@/features/queue/hooks/useStaffAgents'
import { cn } from '@/lib/utils'

import { useUpdateTicketAssignee } from '../hooks/useUpdateTicketAssignee'
import { useUpdateTicketPriority } from '../hooks/useUpdateTicketPriority'
import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus'
import {
  getPriorityLabel,
  getPrioritySelectClass,
  getStatusLabel,
  getStatusSelectClass,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../lib/ticketHelpers'
import type { StaffTicketPermissions, Ticket, TicketPriority, TicketStatus } from '../types/ticket.types'

const UNASSIGNED = 'unassigned'

interface TicketSidebarControlsProps {
  ticket: Ticket
  permissions: StaffTicketPermissions
}

function StatusIcon({ status }: { status: TicketStatus }) {
  if (status === 'waiting') return <Clock className="size-4 shrink-0" aria-hidden="true" />
  if (status === 'resolved' || status === 'closed') return <Minus className="size-4 shrink-0" aria-hidden="true" />
  return <Circle className="size-3.5 shrink-0 fill-current" aria-hidden="true" />
}

function PriorityIcon({ priority }: { priority: TicketPriority }) {
  if (priority === 'low') return <ArrowDown className="size-4 shrink-0" aria-hidden="true" />
  if (priority === 'normal') return <Minus className="size-4 shrink-0" aria-hidden="true" />
  return <ArrowUp className="size-4 shrink-0" aria-hidden="true" />
}

export function TicketSidebarControls({ ticket, permissions }: TicketSidebarControlsProps) {
  const currentUser = useAuthStore((state) => state.user)
  const updateStatus = useUpdateTicketStatus()
  const updatePriority = useUpdateTicketPriority()
  const updateAssignee = useUpdateTicketAssignee()
  const { data: agents = [] } = useStaffAgents(permissions.canAssign)

  const expectedVersion = typeof ticket.version === 'number' ? ticket.version : undefined
  const assigneeValue = ticket.assignee?.id ?? UNASSIGNED
  const assigneeOptions =
    ticket.assignee && !agents.some((agent) => agent.id === ticket.assignee?.id)
      ? [{ id: ticket.assignee.id, name: ticket.assignee.name }, ...agents]
      : agents
  const canAssignToMe = permissions.canAssign && Boolean(currentUser?.id) && ticket.assignee?.id !== currentUser?.id

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ticket-status" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Status
        </label>
        <Select
          value={ticket.status}
          onValueChange={(value) => {
            if (typeof value !== 'string' || value === ticket.status) return
            updateStatus.mutate({
              ticketId: ticket.id,
              status: value as TicketStatus,
              ...(expectedVersion !== undefined ? { expectedVersion } : {}),
            })
          }}
          disabled={!permissions.canChangeStatus || updateStatus.isPending}
        >
          <SelectTrigger
            id="ticket-status"
            className={cn('h-10 w-full justify-between font-medium', getStatusSelectClass(ticket.status))}
          >
            <SelectValue>
              <span className="flex items-center gap-2">
                <StatusIcon status={ticket.status} />
                {getStatusLabel(ticket.status)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="w-(--anchor-width)">
            {TICKET_STATUSES.filter((option) => option.value !== 'all').map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ticket-priority" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Priority
        </label>
        <Select
          value={ticket.priority}
          onValueChange={(value) => {
            if (typeof value !== 'string' || value === ticket.priority) return
            updatePriority.mutate({
              ticketId: ticket.id,
              priority: value as TicketPriority,
              ...(expectedVersion !== undefined ? { expectedVersion } : {}),
            })
          }}
          disabled={!permissions.canChangePriority || updatePriority.isPending}
        >
          <SelectTrigger
            id="ticket-priority"
            className={cn('h-10 w-full justify-between font-medium', getPrioritySelectClass(ticket.priority))}
          >
            <SelectValue>
              <span className="flex items-center gap-2">
                <PriorityIcon priority={ticket.priority} />
                {getPriorityLabel(ticket.priority)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="w-(--anchor-width)">
            {TICKET_PRIORITIES.filter((option) => option.value !== 'all').map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="ticket-assignee"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Assignee
          </label>
          {canAssignToMe && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 text-xs"
              disabled={updateAssignee.isPending}
              onClick={() => {
                if (!currentUser?.id) return
                updateAssignee.mutate({
                  ticketId: ticket.id,
                  assigneeId: currentUser.id,
                  expectedAssigneeId: ticket.assignee?.id ?? null,
                })
              }}
            >
              Assign to me
            </Button>
          )}
        </div>
        <Select
          value={assigneeValue}
          onValueChange={(value) => {
            if (typeof value !== 'string') return
            const nextAssigneeId = value === UNASSIGNED ? null : value
            const currentAssigneeId = ticket.assignee?.id ?? null
            if (nextAssigneeId === currentAssigneeId) return
            updateAssignee.mutate({
              ticketId: ticket.id,
              assigneeId: nextAssigneeId,
              expectedAssigneeId: currentAssigneeId,
            })
          }}
          disabled={!permissions.canAssign || updateAssignee.isPending}
        >
          <SelectTrigger id="ticket-assignee" className="h-10 w-full justify-between border-border bg-card">
            <SelectValue>{ticket.assignee?.name ?? 'Unassigned'}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="w-(--anchor-width)">
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {assigneeOptions.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
