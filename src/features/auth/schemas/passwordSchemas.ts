import { z } from 'zod'

import { getPasswordStrength } from '../lib/passwordStrength'

export const emailSchema = z.string().trim().min(1, 'Enter your email').pipe(z.email('Enter a valid email address'))

/** Same rule as the server for signup, reset and change password. */
export const newPasswordSchema = z.string().superRefine((password, ctx) => {
  if (!password) {
    ctx.addIssue({ code: 'custom', message: 'Enter a password' })
    return
  }
  const { isAcceptable, missing } = getPasswordStrength(password)
  if (!isAcceptable) {
    ctx.addIssue({
      code: 'custom',
      message: `Too weak. Meet at least 3 of these rules (length is required). Missing: ${missing.join('; ')}`,
    })
  }
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name').max(100, 'Name must be 100 characters or fewer'),
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
