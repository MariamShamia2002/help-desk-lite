import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

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
    return <ProfileSkeleton />
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

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-live="polite" aria-label="Loading your profile…">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-10 w-28" />
      <span className="sr-only">Loading your profile…</span>
    </div>
  )
}
