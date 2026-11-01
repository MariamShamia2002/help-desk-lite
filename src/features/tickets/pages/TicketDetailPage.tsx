import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { getErrorMessage, isNotFound } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { EditTicketForm } from '../components/EditTicketForm'
import { ReplyComposer } from '../components/ReplyComposer'
import { TicketDetailsSidebar } from '../components/TicketDetailsSidebar'
import { TicketHeader } from '../components/TicketHeader'
import { TicketTimeline } from '../components/TicketTimeline'
import { useTicket } from '../hooks/useTicket'
import { isStaffTicketPermissions } from '../types/ticket.types'

export default function TicketDetailPage() {
  const { ticketId: ticketIdParam } = useParams()
  const ticketId = Number(ticketIdParam)
  const isValidId = Number.isInteger(ticketId) && ticketId > 0
  const { data: ticket=null, isLoading, isError, error, refetch } = useTicket(isValidId ? ticketId : 0)
  const capabilities = useAuthStore((state) => state.capabilities)
  const [isEditing, setIsEditing] = useState(false)
  const back = hasCapability(capabilities, 'queue:view')
    ? { to: '/queue', label: 'Queue' }
    : { to: '/tickets', label: 'My tickets' }



  if (isLoading) {
    return <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading ticket...</div>
  }
  
  if (!isValidId || (isError && isNotFound(error))) {
    return (
      <section className="flex flex-col items-start gap-4">
        <h1 className="font-heading text-2xl font-semibold">Ticket not found</h1>
        <p className="text-muted-foreground">This ticket does not exist or you do not have access to it.</p>
        <Button nativeButton={false} render={<Link to={back.to} />}>
          Back to {back.label}
        </Button>
      </section>
    )
  }
  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(error, 'Failed to load this ticket. Please try again.')}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const staffPermissions = isStaffTicketPermissions(ticket.permissions) ? ticket.permissions : null

  return (
    <section className="flex flex-col gap-6">
      <TicketHeader ticket={ticket} onEdit={() => setIsEditing(true)} />
      {isEditing && (
        <EditTicketForm ticket={ticket} onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
      )}

      {staffPermissions ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <TicketTimeline messages={ticket.messages} />
            <ReplyComposer ticket={ticket} />
          </div>
          <TicketDetailsSidebar ticket={ticket} permissions={staffPermissions} />
        </div>
      ) : (
        <>
          <TicketTimeline messages={ticket.messages} />
          <ReplyComposer ticket={ticket} />
        </>
      )}
    </section>
  )
}
