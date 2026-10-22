import { UserAvatar } from '@/components/shared/UserAvatar'

import { formatRelativeTime, getCategoryLabel } from '../lib/ticketHelpers'
import type { Ticket } from '../types/ticket.types'

interface TicketSidebarMetaProps {
  ticket: Ticket
}

export function TicketSidebarMeta({ ticket }: TicketSidebarMetaProps) {
  return (
    <>
      {ticket.requester && (
        <div className="mb-5">
          <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Requester</h3>
          <div className="flex items-center gap-3">
            <UserAvatar name={ticket.requester.name} className="size-10 bg-muted text-sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{ticket.requester.name}</p>
              {ticket.requester.email && (
                <p className="truncate text-sm text-muted-foreground">{ticket.requester.email}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Ticket</dt>
        <dd className="text-right font-mono text-foreground">#{ticket.id}</dd>
        <dt className="text-muted-foreground">Created</dt>
        <dd className="text-right text-foreground">{formatRelativeTime(ticket.createdAt)}</dd>
        <dt className="text-muted-foreground">Category</dt>
        <dd className="text-right text-foreground">{ticket.category ? getCategoryLabel(ticket.category) : '—'}</dd>
        <dt className="text-muted-foreground">Updated</dt>
        <dd className="text-right text-foreground">{formatRelativeTime(ticket.updatedAt)}</dd>
      </dl>
    </>
  )
}
