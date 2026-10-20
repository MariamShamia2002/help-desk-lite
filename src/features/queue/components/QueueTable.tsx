import { UserAvatar } from '@/components/shared/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
  TICKET_STATUSES,
} from '@/features/tickets/lib/ticketHelpers'
import type { TicketPriority, TicketStatus } from '@/features/tickets/types/ticket.types'

import { useUpdateTicketPriority } from '../hooks/useUpdateTicketPriority'
import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus'
import { formatWaiting } from '../lib/formatWaiting'
import type { QueueItem } from '../types/queue.types'

const PRIORITY_OPTIONS: { label: string; value: TicketPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

interface QueueTableProps {
  tickets: QueueItem[]
}

export function QueueTable({ tickets }: QueueTableProps) {
  const updateStatus = useUpdateTicketStatus()
  const updatePriority = useUpdateTicketPriority()

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="w-32">Priority</TableHead>
            <TableHead className="w-48">Assignee</TableHead>
            <TableHead className="w-28">Waiting</TableHead>
            <TableHead className="w-40">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">#{ticket.id}</TableCell>
              <TableCell>
                <div className="font-medium">{ticket.title}</div>
                <div className="text-sm text-muted-foreground">{ticket.requester.name}</div>
              </TableCell>
              <TableCell>
                <Select
                  value={ticket.status}
                  onValueChange={(value) => {
                    if (typeof value === 'string') {
                      updateStatus.mutate({ ticketId: ticket.id, status: value as TicketStatus })
                    }
                  }}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger
                    className="h-auto w-auto border-0 bg-transparent p-0 shadow-none hover:bg-muted focus:ring-0"
                    aria-label={`Change status for ticket ${ticket.id}`}
                  >
                    <Badge variant={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUSES.filter((s) => s.value !== 'all').map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={ticket.priority}
                  onValueChange={(value) => {
                    if (typeof value === 'string') {
                      updatePriority.mutate({ ticketId: ticket.id, priority: value as TicketPriority })
                    }
                  }}
                  disabled={updatePriority.isPending}
                >
                  <SelectTrigger
                    className="h-auto w-auto border-0 bg-transparent p-0 shadow-none hover:bg-muted focus:ring-0"
                    aria-label={`Change priority for ticket ${ticket.id}`}
                  >
                    <span className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {ticket.assignee ? (
                  <span className="flex items-center gap-2">
                    <UserAvatar name={ticket.assignee.name} className="size-6 text-[10px]" />
                    <span>{ticket.assignee.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {formatWaiting(ticket.status, ticket.lastActivityAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <time dateTime={ticket.updatedAt}>
                  {new Date(ticket.updatedAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </time>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
