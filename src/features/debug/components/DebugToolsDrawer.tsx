import { useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Bug, X } from 'lucide-react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/api/errors'
import type { Role } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getMe } from '@/features/auth/api/authApi'
import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ticketQueryKey } from '@/features/tickets/hooks/useTicket'
import { cn } from '@/lib/utils'
import { router } from '@/router'

import {
  armAssignmentConflict,
  deactivateMe,
  deleteTicketElsewhere,
  expireAccessToken,
  expireSession,
  resetDemoData,
  revokeRefreshToken,
  setDebugRole,
} from '../api/debugApi'
import { DEBUG_SIGN_OUT_CHANNEL, isDebugOffline, setDebugOffline } from '../lib/debugArm'

const ROLES: Role[] = ['customer', 'agent', 'admin']

async function runDebug(label: string, action: () => Promise<unknown>, probeMe = false) {
  try {
    await action()
    if (probeMe) {
      try {
        await getMe()
      } catch {
        // Expected when session was killed; auth store handles sign-out / deactivate.
      }
    }
    toast.success(label)
  } catch (err) {
    toast.error(getErrorMessage(err, `${label} failed`))
  }
}

/** Floating DEV-only drawer for API debug toolkit + client simulations. */
export function DebugToolsDrawer() {
  const queryClient = useQueryClient()
  const capabilities = useAuthStore((state) => state.capabilities)
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<Role>('agent')
  const [ticketId, setTicketId] = useState('')
  const [offline, setOffline] = useState(isDebugOffline)

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div
          className="pointer-events-auto flex max-h-[min(80vh,40rem)] w-[22rem] flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10"
          role="dialog"
          aria-label="Debug tools"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bug className="size-4" aria-hidden />
              Debug tools
            </div>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Close debug tools" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-3 text-sm">
            <Section title="Token">
              <ActionButton
                onClick={() => void runDebug('Expired access token (refresh should succeed)', expireAccessToken, true)}
              >
                Expire token, silent refresh
              </ActionButton>
              <ActionButton onClick={() => void runDebug('Expired session (refresh should fail)', expireSession, true)}>
                Expire token, refresh fails
              </ActionButton>
              <ActionButton onClick={() => void runDebug('Refresh revoked', revokeRefreshToken, true)}>
                Revoke refresh token
              </ActionButton>
            </Section>

            <Section title="Account">
              <div className="flex flex-wrap gap-1">
                {ROLES.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={role === value ? 'default' : 'outline'}
                    onClick={() => setRole(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <ActionButton onClick={() => void runDebug(`Role set to ${role}`, () => setDebugRole(role), true)}>
                Change my role on server
              </ActionButton>
              <ActionButton
                variant="destructive"
                onClick={() => void runDebug('Account deactivated', deactivateMe, true)}
              >
                Deactivate me now
              </ActionButton>
            </Section>

            <Section title="Tickets">
              <ActionButton onClick={() => void runDebug('Assignment conflict armed', armAssignmentConflict)}>
                Next assignment conflicts
              </ActionButton>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Ticket id"
                  value={ticketId}
                  onChange={(event) => setTicketId(event.target.value)}
                  aria-label="Ticket id to delete elsewhere"
                  className="h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!Number.isInteger(Number(ticketId)) || Number(ticketId) < 1}
                  onClick={() =>
                    void runDebug(`Ticket ${ticketId} deleted elsewhere`, async () => {
                      const id = Number(ticketId)
                      await deleteTicketElsewhere(id)
                      queryClient.removeQueries({ queryKey: ticketQueryKey(id) })
                      void queryClient.invalidateQueries({ queryKey: ['tickets'] })
                      void queryClient.invalidateQueries({ queryKey: ['queue'] })
                      if (router.state.location.pathname === `/tickets/${id}`) {
                        void router.navigate(
                          hasCapability(capabilities, 'queue:view') ? '/queue' : '/tickets',
                          { replace: true },
                        )
                      }
                    })
                  }
                >
                  Delete elsewhere
                </Button>
              </div>
            </Section>

            <Section title="Client-only">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={offline}
                  onChange={(event) => {
                    const next = event.target.checked
                    setOffline(next)
                    setDebugOffline(next)
                    toast.message(next ? 'Offline simulation on' : 'Offline simulation off')
                  }}
                />
                Simulate offline
              </label>
              <ActionButton
                onClick={() => {
                  const channel = new BroadcastChannel(DEBUG_SIGN_OUT_CHANNEL)
                  channel.postMessage({ type: 'sign-out' })
                  channel.close()
                  toast.message('Sign-out signal sent to other tabs')
                }}
              >
                Sign out in another tab
              </ActionButton>
            </Section>

            <Section title="Data">
              <ActionButton
                variant="destructive"
                onClick={() => {
                  if (!window.confirm('Reset demo data? Everyone will be signed out.')) return
                  void runDebug('Demo data reset', resetDemoData, true)
                }}
              >
                Reset demo data
              </ActionButton>
            </Section>
          </div>
        </div>
      )}

      <Button
        type="button"
        size="sm"
        className={cn('pointer-events-auto shadow-md', open && 'ring-2 ring-primary')}
        onClick={() => setOpen((value) => !value)}
      >
        <Bug className="size-4" aria-hidden />
        Debug
      </Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function ActionButton({
  children,
  onClick,
  variant = 'outline',
}: {
  children: ReactNode
  onClick: () => void
  variant?: 'outline' | 'destructive' | 'default'
}) {
  return (
    <Button type="button" size="sm" variant={variant} className="justify-start" onClick={onClick}>
      {children}
    </Button>
  )
}
