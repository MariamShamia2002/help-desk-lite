import { useState } from 'react'
import { toast } from 'sonner'

import type { Role } from '@/api/types'
import { getErrorMessage, hasCode } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { useUpdateUserRole } from '../hooks/useUpdateUserRole'
import type { AdminUser } from '../types/user.types'

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: 'customer', label: 'Customer', description: 'Can open and manage their own tickets.' },
  { value: 'agent', label: 'Agent', description: 'Can work the queue and reply to tickets.' },
  { value: 'admin', label: 'Admin', description: 'Full access, including user management.' },
]

interface ChangeRoleDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeRoleDialog({ user, open, onOpenChange }: ChangeRoleDialogProps) {
  const updateRole = useUpdateUserRole()
  const [role, setRole] = useState<Role>(user?.role ?? 'agent')
  const [inlineError, setInlineError] = useState<string | null>(null)

  if (!user) return null

  const unchanged = role === user.role

  const handleSave = () => {
    if (unchanged) return
    setInlineError(null)
    updateRole.mutate(
      { userId: user.id, role },
      {
        onSuccess: () => {
          toast.success(`Role updated to ${ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role}.`)
          onOpenChange(false)
        },
        onError: (err) => {
          if (hasCode(err, 'CANNOT_CHANGE_OWN_ROLE') || hasCode(err, 'LAST_ADMIN')) {
            setInlineError(getErrorMessage(err))
            return
          }
          toast.error(getErrorMessage(err, 'Failed to update role. Please try again.'))
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !updateRole.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md" showCloseButton={!updateRole.isPending}>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the role for <span className="font-medium text-foreground">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {inlineError && (
          <Alert variant="destructive">
            <AlertDescription>{inlineError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2" role="radiogroup" aria-label="Role">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={updateRole.isPending}
                onClick={() => {
                  setRole(option.value)
                  setInlineError(null)
                }}
                className={cn(
                  'rounded-lg border px-3 py-3 text-left transition-colors',
                  selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/40',
                )}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
              </button>
            )
          })}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={updateRole.isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={unchanged || updateRole.isPending} onClick={handleSave}>
            {updateRole.isPending ? 'Saving…' : 'Save role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
