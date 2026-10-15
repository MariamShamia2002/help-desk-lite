import { LoaderCircle } from 'lucide-react'

import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { AccountSection } from '../components/AccountSection'
import { ActiveSessions } from '../components/ActiveSessions'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { ProfileForm } from '../components/ProfileForm'
import { useAccount } from '../hooks/useAccount'

export default function AccountSecurityPage() {
  return (
    <div className="flex w-full max-w-240 flex-col gap-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Account &amp; security</h1>

      <AccountSection id="profile" title="Profile">
        <ProfileContent />
      </AccountSection>

      <AccountSection id="change-password" title="Change password">
        <ChangePasswordForm />
      </AccountSection>

      <ActiveSessions />
    </div>
  )
}

function ProfileContent() {
  const accountQuery = useAccount()

  if (accountQuery.isPending) {
    return (
      <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Loading your profile…
      </div>
    )
  }

  if (accountQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          Couldn't load your profile. {getErrorMessage(accountQuery.error)}
          <Button variant="outline" size="sm" onClick={() => void accountQuery.refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <ProfileForm account={accountQuery.data} />
}
