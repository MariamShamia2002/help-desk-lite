import { toast } from 'sonner'

import { getErrorMessage, isNotFound } from '@/api/errors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useRevokeSession } from '../hooks/useSessions'
import { formatLastActive } from '../lib/formatLastActive'
import type { AccountSession } from '../types/account.types'

interface SessionRowProps {
  session: AccountSession
}

export function SessionRow({ session }: SessionRowProps) {
  const revokeMutation = useRevokeSession()

  const lastActive = session.current ? 'Active now' : formatLastActive(session.lastUsedAt)
  const details = [session.location ?? 'Unknown location', session.ipMasked ?? 'IP unavailable', lastActive]

  const handleSignOut = () => {
    revokeMutation.mutate(session.id, {
      onSuccess: () => toast.success(`Signed out of ${session.device}.`),
      onError: (err) => {
        if (isNotFound(err)) toast.info('That session had already ended.')
        else toast.error(getErrorMessage(err))
      },
    })
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-medium text-foreground">{session.device}</span>
          {session.current && <Badge className="bg-success/10 text-success">This device</Badge>}
        </div>
        <p className="mt-1 font-mono text-xs break-words text-muted-foreground">{details.join(' · ')}</p>
      </div>

      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={revokeMutation.isPending}
          aria-label={`Sign out ${session.device}, last active ${lastActive.toLowerCase()}`}
        >
          {revokeMutation.isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      )}
    </li>
  )
}
