import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { getRoleLabel } from '../lib/userHelpers'
import type { CreateUserResponse } from '../types/user.types'

interface UserCreatedDialogProps {
  open: boolean
  response: CreateUserResponse | null
  onOpenChange: (open: boolean) => void
}

export function UserCreatedDialog({ open, response, onOpenChange }: UserCreatedDialogProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) setCopied(false)
  }, [open, response])

  if (!response) return null

  const { user, temporaryPassword } = response
  const hasPassword = Boolean(temporaryPassword)

  const handleCopy = async () => {
    if (!hasPassword || copied) return
    try {
      await navigator.clipboard.writeText(temporaryPassword)
      setCopied(true)
    } catch {
      // Leave the button enabled so the admin can try again.
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
      }}
    >
      <DialogContent className="gap-6 sm:max-w-lg" showCloseButton={false}>
        <DialogHeader className="gap-3 text-center sm:text-center">
          <DialogTitle className="text-xl">{user.name} was added</DialogTitle>
          <DialogDescription className="text-balance">
            Share these credentials securely. The temporary password is shown only once and must be changed on first
            sign-in.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <dl className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Email</dt>
              <dd className="break-all text-sm font-medium">{user.email}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Role</dt>
              <dd>
                <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Temporary password</dt>
              <dd className="font-mono text-sm break-all">
                {hasPassword ? temporaryPassword : 'Password was not returned. Ask the user to use forgot password.'}
              </dd>
            </div>
          </dl>

          {hasPassword && (
            <Button type="button" variant="outline" className="mt-4 w-full" disabled={copied} onClick={() => void handleCopy()}>
              {copied ? 'Copied' : 'Copy password'}
            </Button>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button type="button" className="min-w-32" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
