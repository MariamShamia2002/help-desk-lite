import { z } from 'zod'

import { emailSchema } from '@/features/auth/schemas/passwordSchemas'

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(100, 'Name must be 100 characters or fewer'),
  email: emailSchema,
  role: z.enum(['agent', 'admin'], { message: 'Select a role' }),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
