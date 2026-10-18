import { LoaderCircle } from 'lucide-react'

import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { useSessions } from '../hooks/useSessions'
import type { AccountSession } from '../types/account.types'
import { AccountSection } from './AccountSection'
import { SessionRow } from './SessionRow'
import { SignOutEverywhereDialog } from './SignOutEverywhereDialog'

export function ActiveSessions() {
  const sessionsQuery = useSessions()

  return (
    <AccountSection id="active-sessions" title="Active sessions" action={<SignOutEverywhereDialog />}>
      <SessionsContent query={sessionsQuery} />
    </AccountSection>
  )
}

interface SessionsContentProps {
  query: ReturnType<typeof useSessions>
}

function SessionsContent({ query }: SessionsContentProps) {
  if (query.isPending) {
    return (
      <div
        role="status"
        className="flex items-center gap-2 rounded-lg border border-border px-5 py-6 text-sm text-muted-foreground"
      >
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Loading sessions…
      </div>
    )
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          Couldn't load your sessions. {getErrorMessage(query.error)}
          <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (query.data.length === 0) {
    return (
      <p className="rounded-lg border border-border px-5 py-6 text-sm text-muted-foreground">No active sessions.</p>
    )
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {sortSessions(query.data).map((session) => (
        <SessionRow key={session.id} session={session} />
      ))}
    </ul>
  )
}

/** This device first, then most recently used. */
function sortSessions(sessions: AccountSession[]): AccountSession[] {
  return [...sessions].sort(
    (a, b) => Number(b.current) - Number(a.current) || Date.parse(b.lastUsedAt) - Date.parse(a.lastUsedAt),
  )
}
