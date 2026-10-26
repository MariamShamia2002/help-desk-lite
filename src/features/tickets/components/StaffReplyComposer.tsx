import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'
import { cn } from '@/lib/utils'

import { useCreateTicketMessage } from '../hooks/useCreateTicketMessage'
import type { StaffTicketPermissions, Ticket } from '../types/ticket.types'

const replySchema = z.object({
  body: z.string().trim().min(1, 'Reply cannot be empty').max(5000, 'Reply must be 5,000 characters or less'),
})

type ReplyFormData = z.infer<typeof replySchema>
type ReplyKind = 'public' | 'internal'

interface StaffReplyComposerProps {
  ticket: Ticket
  permissions: StaffTicketPermissions
}

function staffReplyKinds(permissions: StaffTicketPermissions): ReplyKind[] {
  const kinds: ReplyKind[] = []
  if (permissions.canReply) kinds.push('public')
  if (permissions.canInternalNote) kinds.push('internal')
  return kinds
}

export function StaffReplyComposer({ ticket, permissions }: StaffReplyComposerProps) {
  const kinds = staffReplyKinds(permissions)
  const [selectedKind, setSelectedKind] = useState<ReplyKind>('public')
  const kind = kinds.includes(selectedKind) ? selectedKind : (kinds[0] ?? 'public')
  const readOnly = kinds.length === 0
  const isInternal = kind === 'internal'
  const requesterName = ticket.requester?.name ?? 'the requester'
  const createMessage = useCreateTicketMessage()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: '' },
  })

  const isPending = isSubmitting || createMessage.isPending

  const onSubmit = async (data: ReplyFormData) => {
    try {
      await createMessage.mutateAsync({
        ticketId: ticket.id,
        payload: { kind, body: data.body },
      })
      reset()
      toast.success(kind === 'internal' ? 'Internal note added' : 'Reply sent')
    } catch (error) {
      applyServerFieldErrors(error, setError, ['body'])
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-4',
        isInternal ? 'border-amber-300 bg-amber-50' : 'border-border bg-card',
      )}
    >
      {kinds.length > 0 && (
        <div className="flex gap-2" role="tablist" aria-label="Reply type">
          {kinds.includes('public') && (
            <Button
              type="button"
              size="sm"
              role="tab"
              aria-selected={kind === 'public'}
              variant={kind === 'public' ? 'outline' : 'ghost'}
              className={cn(
                kind === 'public' && 'border-border bg-card shadow-sm',
                kind !== 'public' && 'text-muted-foreground',
              )}
              onClick={() => setSelectedKind('public')}
            >
              Public reply
            </Button>
          )}
          {kinds.includes('internal') && (
            <Button
              type="button"
              size="sm"
              role="tab"
              aria-selected={kind === 'internal'}
              variant={kind === 'internal' ? 'outline' : 'ghost'}
              className={cn(
                kind === 'internal' && 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-50',
                kind !== 'internal' && 'text-muted-foreground',
              )}
              onClick={() => setSelectedKind('internal')}
            >
              <Lock className="size-3.5" aria-hidden="true" />
              Internal note
            </Button>
          )}
        </div>
      )}

      <Textarea
        id="reply-body"
        rows={5}
        placeholder={isInternal ? 'Write a note for the team...' : `Reply to ${requesterName}...`}
        disabled={readOnly || isPending}
        maxLength={5000}
        aria-invalid={!!errors.body}
        aria-describedby={errors.body ? getErrorId('reply-body') : undefined}
        className={cn(
          'min-h-32 bg-card',
          isInternal && 'border-amber-200 bg-amber-50/80 placeholder:text-amber-900/50',
        )}
        {...register('body')}
      />

      {errors.body && (
        <p id={getErrorId('reply-body')} role="alert" className="text-sm text-destructive">
          {errors.body.message}
        </p>
      )}

      {readOnly ? (
        <p className="text-sm text-muted-foreground">You can&apos;t reply to this ticket.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={cn(
              'flex items-start gap-1.5 text-sm',
              isInternal ? 'text-amber-900/80' : 'text-muted-foreground',
            )}
          >
            {isInternal ? (
              <>
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>Only visible to staff. {requesterName} will never see this.</span>
              </>
            ) : (
              <span>Visible to {requesterName}.</span>
            )}
          </p>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Sending...' : isInternal ? 'Add internal note' : 'Send reply'}
          </Button>
        </div>
      )}
    </form>
  )
}
