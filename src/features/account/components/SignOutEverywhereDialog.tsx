import { useState } from 'react'
import { LogOut } from 'lucide-react'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { useRevokeAllSessions } from '../hooks/useSessions'

/** On success the server has ended this session too; the auth flow redirects to sign in. */
export function SignOutEverywhereDialog() {
  const [open, setOpen] = useState(false)
  const revokeAllMutation = useRevokeAllSessions()
  const isPending = revokeAllMutation.isPending

  const handleConfirm = () => {
    revokeAllMutation.mutate(undefined, {
      onError: (err) => toast.error(getErrorMessage(err)),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <LogOut aria-hidden="true" />
        Sign out everywhere
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out everywhere?</AlertDialogTitle>
          <AlertDialogDescription>
            This ends every session, including this one. You'll need to sign in again on each device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Signing out…' : 'Sign out everywhere'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
