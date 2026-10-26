import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
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

import { useRevokeAllUserSessions } from '../hooks/useRevokeAllUserSessions'
import type { AdminUser } from '../types/user.types'

interface ForceSignOutDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForceSignOutDialog({ user, open, onOpenChange }: ForceSignOutDialogProps) {
  const revokeAll = useRevokeAllUserSessions()

  if (!user) return null

  const handleConfirm = () => {
    revokeAll.mutate(user.id, {
      onSuccess: () => {
        toast.success(`Signed out all sessions for ${user.name}.`)
        onOpenChange(false)
      },
      onError: (err) => toast.error(getErrorMessage(err, 'Failed to sign out sessions. Please try again.')),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !revokeAll.isPending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Force sign-out {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This ends every active session for this user. They will need to sign in again on each device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={revokeAll.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={revokeAll.isPending} onClick={handleConfirm}>
            {revokeAll.isPending ? 'Signing out…' : 'Force sign-out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
