import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().min(5, 'Title is required').max(120, 'Title must be 120 characters or less'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be 5,000 characters or less'),
  category: z.enum(['bug', 'billing', 'account', 'integrations', 'performance', 'feature_request', 'other']).optional(),
})

export type CreateTicketFormData = z.infer<typeof createTicketSchema>
