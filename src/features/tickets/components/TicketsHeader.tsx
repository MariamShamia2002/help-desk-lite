import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

interface TicketsHeaderProps {
  ticketCount: number
}

export function TicketsHeader({ ticketCount }: TicketsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My tickets</h1>
        <p className="text-sm text-muted-foreground">{ticketCount} total tickets</p>
      </div>
      <Button nativeButton={false} render={<Link to="/tickets/new" />}>
        New ticket
      </Button>
    </div>
  )
}
