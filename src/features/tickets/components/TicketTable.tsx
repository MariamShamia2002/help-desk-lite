import { Link, useNavigate } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { getPriorityColor, getPriorityLabel, getStatusColor, getStatusLabel } from '../lib/ticketHelpers'
import type { TicketListItem } from '../types/ticket.types'

interface TicketTableProps {
  tickets: TicketListItem[]
}

interface TicketEmptyStateProps {
  hasSearch: boolean
}

export function TicketEmptyState({ hasSearch }: TicketEmptyStateProps) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        {hasSearch ? 'No tickets found matching your search.' : 'No tickets yet.'}
      </p>
      {!hasSearch && (
        <Button nativeButton={false} render={<Link to="/tickets/new" />} variant="outline" className="mt-4">
          Create your first ticket
        </Button>
      )}
    </div>
  )
}

export function TicketTable({ tickets }: TicketTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="w-32">Priority</TableHead>
            <TableHead className="w-24 text-center">Replies</TableHead>
            <TableHead className="w-40">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/tickets/${ticket.id}`)
                }
              }}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">#{ticket.id}</TableCell>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
              </TableCell>
              <TableCell>
                <span className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</span>
              </TableCell>
              <TableCell className="text-center">{ticket.replyCount}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
