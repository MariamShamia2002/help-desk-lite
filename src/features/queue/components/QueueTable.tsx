import { UserAvatar } from '@/components/shared/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
} from '@/features/tickets/lib/ticketHelpers'

import { formatWaiting } from '../lib/formatWaiting'
import type { QueueItem } from '../types/queue.types'

interface QueueTableProps {
  tickets: QueueItem[]
}

export function QueueTable({ tickets }: QueueTableProps) {
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
                <Badge variant={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
              </TableCell>
              <TableCell>
                <span className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</span>
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
