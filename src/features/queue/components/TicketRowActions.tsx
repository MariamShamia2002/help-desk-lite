import { useState } from 'react'
import { Link } from 'react-router'
import { Copy, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useDeleteTicket } from '@/features/tickets/hooks/useDeleteTicket'

interface TicketRowActionsProps {
  ticketId: number
}

export function TicketRowActions({ ticketId }: TicketRowActionsProps) {
  const capabilities = useAuthStore((state) => state.capabilities)
  const canDelete = hasCapability(capabilities, 'tickets:delete')
  const deleteTicket = useDeleteTicket()
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
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
          {canDelete && (
            <DropdownMenuItem
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              <span>Delete ticket</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={(next) => !deleteTicket.isPending && setDeleteOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ticket #{ticketId}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes the ticket and its conversation.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTicket.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteTicket.isPending}
              onClick={() => {
                deleteTicket.mutate(ticketId, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }}
            >
              {deleteTicket.isPending ? 'Deleting...' : 'Delete ticket'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
