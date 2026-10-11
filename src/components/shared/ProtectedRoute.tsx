import { Ban, ShieldX } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Capability } from '@/features/auth/types/auth.types'

import { FullPageLoader, FullPageStatus } from './FullPageStatus'

interface ProtectedRouteProps {
  /** Every listed capability is required. Omit to only require a signed-in user. */
  capability?: Capability | Capability[]
}

/**
 * UI-level guard only — it hides what the user can't use. The server re-checks
 * every request, so this is never the security boundary.
 */
export default function ProtectedRoute({ capability }: ProtectedRouteProps) {
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const capabilities = useAuthStore((state) => state.capabilities)
  const signOutReason = useAuthStore((state) => state.signOutReason)

  if (status === 'idle' || status === 'loading') return <FullPageLoader />

  if (status === 'deactivated') {
    return (
      <FullPageStatus
        icon={<Ban className="size-8 text-destructive" aria-hidden="true" />}
        title="Your account has been deactivated"
        description="Contact an administrator if you think this is a mistake."
      />
    )
  }

  if (status === 'unauthenticated') {
    // After a deliberate sign-out the next person shouldn't land on the previous user's page.
    if (signOutReason === 'manual') return <Navigate to="/login" replace />
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />
  }

  if (capability && !hasCapability(capabilities, capability)) {
    return (
      <FullPageStatus
        icon={<ShieldX className="size-8 text-muted-foreground" aria-hidden="true" />}
        title="You don't have access to this page"
        description="Your account doesn't have permission to view it."
        action={<Button nativeButton={false} render={<Link to="/" />}>Go to my home page</Button>}
      />
    )
  }

  return <Outlet />
}
