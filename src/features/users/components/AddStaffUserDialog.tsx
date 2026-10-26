import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'
import { cn } from '@/lib/utils'

import { useCreateUser } from '../hooks/useCreateUser'
import { createUserSchema, type CreateUserFormValues } from '../schemas/userSchemas'
import type { CreateUserResponse, StaffRole } from '../types/user.types'

const ROLE_OPTIONS: { value: StaffRole; label: string; description: string }[] = [
  { value: 'agent', label: 'Agent', description: 'Works the queue: sees every ticket, replies, writes internal notes, sets status, priority and assignee.' },
  { value: 'admin', label: 'Admin', description: 'Everything an agent can do, plus manage users and roles and permanently delete tickets.' },
]

interface AddStaffUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (response: CreateUserResponse) => void
}

export function AddStaffUserDialog({ open, onOpenChange, onCreated }: AddStaffUserDialogProps) {
  const createUserMutation = useCreateUser()
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: 'agent' },
  })

  useEffect(() => {
    if (!open) reset({ name: '', email: '', role: 'agent' })
  }, [open, reset])

  const onSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values, {
      onSuccess: onCreated,
      onError: (err) => {
        if (!applyServerFieldErrors(err, setError, ['name', 'email', 'role'])) {
          toast.error(getErrorMessage(err, 'Failed to create user. Please try again.'))
        }
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!createUserMutation.isPending}>
        <DialogHeader>
          <DialogTitle>Add staff user</DialogTitle>
          <DialogDescription>Create an agent or admin account and share the one-time password securely.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField id="create-user-name" label="Name" error={errors.name?.message}>
            <Input
              id="create-user-name"
              autoComplete="name"
              autoFocus
              disabled={createUserMutation.isPending}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? getErrorId('create-user-name') : undefined}
              {...register('name')}
            />
          </FormField>

          <FormField id="create-user-email" label="Email" error={errors.email?.message}>
            <Input
              id="create-user-email"
              type="email"
              autoComplete="email"
              disabled={createUserMutation.isPending}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? getErrorId('create-user-email') : undefined}
              {...register('email')}
            />
          </FormField>

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <fieldset className="flex flex-col gap-2" disabled={createUserMutation.isPending}>
                <legend className="text-sm font-medium">Role</legend>
                <div className="grid gap-2" role="radiogroup" aria-label="Role">
                  {ROLE_OPTIONS.map((option) => {
                    const selected = field.value === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          'rounded-lg border px-3 py-3 text-left transition-colors',
                          selected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:bg-muted/40',
                        )}
                      >
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.role && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </fieldset>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createUserMutation.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
