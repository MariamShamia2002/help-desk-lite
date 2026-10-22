import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { hasCode } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useUpdateTicket } from '../hooks/useUpdateTicket'
import { editTicketSchema, type EditTicketFormData } from '../schemas/ticketSchema'
import type { Ticket, UpdateTicketPayload } from '../types/ticket.types'

interface EditTicketFormProps {
  ticket: Ticket
  onCancel: () => void
  onSaved: () => void
}

export function EditTicketForm({ ticket, onCancel, onSaved }: EditTicketFormProps) {
  const updateTicket = useUpdateTicket()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditTicketFormData>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
    },
  })

  useEffect(() => {
    reset({
      title: ticket.title,
      description: ticket.description,
    })
  }, [ticket.description, ticket.id, ticket.title, reset])

  const isPending = isSubmitting || updateTicket.isPending

  const onSubmit = async (data: EditTicketFormData) => {
    const payload: UpdateTicketPayload = {}
    if (data.title !== ticket.title.trim()) payload.title = data.title
    if (data.description !== ticket.description.trim()) payload.description = data.description

    if (Object.keys(payload).length === 0) {
      onSaved()
      return
    }

    try {
      await updateTicket.mutateAsync({ ticketId: ticket.id, payload })
      toast.success('Ticket updated')
      onSaved()
    } catch (error) {
      if (hasCode(error, 'TICKET_NOT_EDITABLE')) {
        onCancel()
        return
      }
      applyServerFieldErrors(error, setError, ['title', 'description'])
    }
  }

  const handleCancel = () => {
    reset({
      title: ticket.title,
      description: ticket.description,
    })
    onCancel()
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-primary bg-card p-5 ring-2 ring-primary/20"
    >
      <h2 className="font-heading text-lg font-semibold">Edit ticket</h2>

      <FormField id="edit-title" label="Title" error={errors.title?.message}>
        <Input
          id="edit-title"
          className="h-12"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? getErrorId('edit-title') : undefined}
          disabled={isPending}
          {...register('title')}
        />
      </FormField>

      <FormField id="edit-description" label="Description" error={errors.description?.message}>
        <Textarea
          id="edit-description"
          rows={10}
          className="min-h-48"
          maxLength={5000}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? getErrorId('edit-description') : undefined}
          disabled={isPending}
          {...register('description')}
        />
      </FormField>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
