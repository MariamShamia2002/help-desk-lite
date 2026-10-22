import { Link } from 'react-router'
import { Copy, ExternalLink, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface TicketRowActionsProps {
  ticketId: number
}

export function TicketRowActions({ ticketId }: TicketRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu for ticket {ticketId}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link to={`/tickets/${ticketId}`} />} className="flex items-center gap-2">
          <ExternalLink className="size-4" />
          <span>Open ticket</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(String(ticketId))
              toast.success('Ticket ID copied to clipboard')
            } catch (error) {
              console.error('Failed to copy:', error)
              toast.error('Failed to copy ticket ID')
            }
          }}
          className="flex items-center gap-2"
        >
          <Copy className="size-4" />
          <span>Copy ticket ID</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
