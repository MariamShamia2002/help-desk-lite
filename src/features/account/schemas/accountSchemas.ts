import { z } from 'zod'

import { newPasswordSchema } from '@/features/auth/schemas/passwordSchemas'

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100, 'Name must be 100 characters or fewer'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })
  // Only an equality check: the server is what verifies the current password.
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current one',
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
