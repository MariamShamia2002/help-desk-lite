import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatLastActive } from '@/features/account/lib/formatLastActive'

import { useUserSessions } from '../hooks/useUserSessions'
import type { AdminUser, AdminUserSession } from '../types/user.types'

interface UserSessionsDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSessionsDialog({ user, open, onOpenChange }: UserSessionsDialogProps) {
  const sessionsQuery = useUserSessions(user?.id, open && Boolean(user))

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sessions</DialogTitle>
          <DialogDescription>
            Active sessions for <span className="font-medium text-foreground">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <SessionsContent query={sessionsQuery} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SessionsContentProps {
  query: ReturnType<typeof useUserSessions>
}

function SessionsContent({ query }: SessionsContentProps) {
  if (query.isLoading) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Loading sessions…</p>
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Couldn't load sessions. {getErrorMessage(query.error)}
        </AlertDescription>
      </Alert>
    )
  }

  const sessions = sortSessions(query.data ?? [])

  if (sessions.length === 0) {
    return <p className="rounded-lg border border-border px-4 py-6 text-sm text-muted-foreground">No active sessions.</p>
  }

  return (
    <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border border-border">
      {sessions.map((session) => (
        <AdminSessionRow key={session.id} session={session} />
      ))}
    </ul>
  )
}

function AdminSessionRow({ session }: { session: AdminUserSession }) {
  const lastActive = session.current ? 'Active now' : formatLastActive(session.lastUsedAt)
  const details = [session.location ?? 'Unknown location', session.ipMasked ?? 'IP unavailable', lastActive]

  return (
    <li className="flex flex-col gap-1 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">{session.device}</span>
        {session.current && <Badge variant="secondary">Current</Badge>}
      </div>
      <p className="font-mono text-xs break-words text-muted-foreground">{details.join(' · ')}</p>
    </li>
  )
}

function sortSessions(sessions: AdminUserSession[]): AdminUserSession[] {
  return [...sessions].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1
    return Date.parse(b.lastUsedAt) - Date.parse(a.lastUsedAt)
  })
}
