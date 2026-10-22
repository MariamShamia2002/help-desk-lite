import { z } from 'zod'

export const ticketCategorySchema = z.enum([
  'Bug',
  'Billing',
  'Account',
  'Integrations',
  'Performance',
  'Feature request',
  'Other',
])

const ticketTextFields = {
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must be 120 characters or less'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be 5,000 characters or less'),
}
/** Matches server rules: title 5–120, description 10–5000, trimmed. */
export const createTicketSchema = z.object({
 ...ticketTextFields,
  category: ticketCategorySchema.optional(),
})

export type CreateTicketFormData = z.infer<typeof createTicketSchema>

/** Customer edit: title and description only — never status, priority, or assignee. */
export const editTicketSchema = z.object({
...ticketTextFields,
})

export type EditTicketFormData = z.infer<typeof editTicketSchema>
