import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useCreateTicketMessage } from '../hooks/useCreateTicketMessage'
import type { Ticket } from '../types/ticket.types'

const replySchema = z.object({
  body: z.string().trim().min(1, 'Reply cannot be empty').max(5000, 'Reply must be 5,000 characters or less'),
})

type ReplyFormData = z.infer<typeof replySchema>

interface CustomerReplyComposerProps {
  ticket: Ticket
  canReply: boolean
}

export function CustomerReplyComposer({ ticket, canReply }: CustomerReplyComposerProps) {
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
        payload: { kind: 'public', body: data.body },
      })
      reset()
      toast.success('Reply sent')
    } catch (error) {
      applyServerFieldErrors(error, setError, ['body'])
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4"
    >
      <Textarea
        id="reply-body"
        rows={5}
        placeholder="Write a reply..."
        disabled={!canReply || isPending}
        maxLength={5000}
        aria-invalid={!!errors.body}
        aria-describedby={errors.body ? getErrorId('reply-body') : undefined}
        className="min-h-32"
        {...register('body')}
      />

      {errors.body && (
        <p id={getErrorId('reply-body')} role="alert" className="text-sm text-destructive">
          {errors.body.message}
        </p>
      )}

      {!canReply ? (
        <p className="text-sm text-muted-foreground">You can&apos;t reply to this ticket.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Our team will be notified.</p>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send reply'}
          </Button>
        </div>
      )}
    </form>
  )
}
