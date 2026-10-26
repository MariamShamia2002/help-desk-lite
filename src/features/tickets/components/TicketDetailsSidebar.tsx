import type { StaffTicketPermissions, Ticket } from '../types/ticket.types'
import { TicketSidebarControls } from './TicketSidebarControls'
import { TicketSidebarMeta } from './TicketSidebarMeta'

interface TicketDetailsSidebarProps {
  ticket: Ticket
  permissions: StaffTicketPermissions
}

export function TicketDetailsSidebar({ ticket, permissions }: TicketDetailsSidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <TicketSidebarControls ticket={ticket} permissions={permissions} />
      <div className="my-5 border-t border-border" />
      <TicketSidebarMeta ticket={ticket} />
    </aside>
  )
}
