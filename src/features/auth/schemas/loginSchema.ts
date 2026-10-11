import { z } from 'zod'

import { emailSchema } from './passwordSchemas'

export const loginSchema = z.object({
  email: emailSchema,
  // No strength rules on login — the server decides if the password is right.
  password: z.string().min(1, 'Enter your password'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
