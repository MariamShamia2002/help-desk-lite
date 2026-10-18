import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useCreateTicket } from '../hooks/useCreateTicket'
import { createTicketSchema, type CreateTicketFormData } from '../schemas/ticketSchema'
import type { CreateTicketPayload } from '../types/ticket.types'
import { TicketCategoryField } from './TicketCategoryField'

const MAX_DESCRIPTION_LENGTH = 5000

export function CreateTicketForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [descriptionLength, setDescriptionLength] = useState(0)
  const createTicketMutation = useCreateTicket()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const isPending = isSubmitting || createTicketMutation.isPending

  const onSubmit = async (data: CreateTicketFormData) => {
    setServerError(null)

    const payload: CreateTicketPayload = {
      title: data.title,
      description: data.description,
      ...(data.category ? { category: data.category } : {}),
    }

    try {
      const ticket = await createTicketMutation.mutateAsync(payload)
      toast.success(`Ticket #${ticket.id} created`)
      navigate('/tickets')
    } catch (err) {
      if (!applyServerFieldErrors(err, setError, ['title', 'description', 'category'])) {
        setServerError(getErrorMessage(err))
      }
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FormField id="title" label="Title" error={errors.title?.message}>
        <Input
          id="title"
          placeholder="Brief summary of the issue"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? getErrorId('title') : undefined}
          {...register('title')}
        />
      </FormField>

      <FormField id="description" label="Description" error={errors.description?.message}>
        <Textarea
          id="description"
          placeholder="Please describe the issue in detail, including any steps to reproduce it..."
          rows={8}
          maxLength={MAX_DESCRIPTION_LENGTH}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? getErrorId('description') : undefined}
          {...register('description', {
            onChange: (e) => setDescriptionLength(e.target.value.length),
          })}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {descriptionLength} / {MAX_DESCRIPTION_LENGTH} characters
        </p>
      </FormField>

      <TicketCategoryField
        value={watch('category')}
        error={errors.category?.message}
        onChange={(category) => setValue('category', category, { shouldValidate: true })}
      />

      <p className="text-sm text-muted-foreground">Priority is set by our team after review.</p>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit ticket'}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={() => navigate('/tickets')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
