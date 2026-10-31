import { useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage, hasCode } from '@/api/errors'
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
import { Alert, AlertDescription } from '@/components/ui/alert'

import { useUpdateUserStatus } from '../hooks/useUpdateUserStatus'
import type { AdminUser } from '../types/user.types'

interface DeactivateUserDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateUserDialog({ user, open, onOpenChange }: DeactivateUserDialogProps) {
  const updateStatus = useUpdateUserStatus()
  const [inlineError, setInlineError] = useState<string | null>(null)

  if (!user) return null

  const handleConfirm = () => {
    setInlineError(null)
    updateStatus.mutate(
      { userId: user.id, active: false },
      {
        onSuccess: () => {
          toast.success(`${user.name} was deactivated.`)
          onOpenChange(false)
        },
        onError: (err) => {
          if (hasCode(err, 'CANNOT_DEACTIVATE_SELF') || hasCode(err, 'LAST_ADMIN')) {
            setInlineError(getErrorMessage(err))
            return
          }
          toast.error(getErrorMessage(err, 'Failed to deactivate user. Please try again.'))
        },
      },
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !updateStatus.isPending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            They will not be able to sign in until an administrator activates the account again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {inlineError && (
          <Alert variant="destructive">
            <AlertDescription>{inlineError}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateStatus.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={updateStatus.isPending} onClick={handleConfirm}>
            {updateStatus.isPending ? 'Deactivating…' : 'Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
