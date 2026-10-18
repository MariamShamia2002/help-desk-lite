import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/shared/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROLE_LABELS } from '@/features/auth/lib/roles'
import { applyServerFieldErrors, getErrorId } from '@/lib/form'

import { useUpdateAccount } from '../hooks/useAccount'
import { profileSchema, type ProfileFormValues } from '../schemas/accountSchemas'
import type { Account } from '../types/account.types'

const EMAIL_HELP_ID = 'account-email-help'

interface ProfileFormProps {
  account: Account
}

export function ProfileForm({ account }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: account.name },
  })
  const name = useWatch({ control, name: 'name' })
  const updateMutation = useUpdateAccount()

  const isUnchanged = name.trim() === account.name

  const onSubmit = (values: ProfileFormValues) => {
    if (values.name === account.name) return
    updateMutation.mutate(values, {
      onSuccess: (updated) => {
        reset({ name: updated.name })
        toast.success('Profile saved.')
      },
      onError: (err) => {
        if (!applyServerFieldErrors(err, setError, ['name'])) toast.error(getErrorMessage(err))
      },
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="account-name" label="Name" error={errors.name?.message}>
          <Input
            id="account-name"
            autoComplete="name"
            className="h-12 bg-card"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? getErrorId('account-name') : undefined}
            {...register('name')}
          />
        </FormField>

        <FormField id="account-email" label="Email">
          <Input
            id="account-email"
            type="email"
            value={account.email}
            readOnly
            aria-describedby={EMAIL_HELP_ID}
            className="h-12 bg-muted text-muted-foreground"
          />
          <p id={EMAIL_HELP_ID} className="text-sm text-muted-foreground">
            Ask an admin to change your email.
          </p>
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">Role</span>
        <Badge className="bg-primary/10 text-primary">{ROLE_LABELS[account.role]}</Badge>
        <span className="text-muted-foreground">Managed by admins</span>
      </div>

      <div>
        <Button type="submit" variant="outline" size="lg" disabled={updateMutation.isPending || isUnchanged}>
          {updateMutation.isPending ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </form>
  )
}
