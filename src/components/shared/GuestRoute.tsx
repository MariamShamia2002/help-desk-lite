import { Navigate, Outlet, useSearchParams } from 'react-router'

import { getHomePath, getSafeReturnTo } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { FullPageLoader } from './FullPageStatus'

/** For sign-in / sign-up pages: signed-in users are sent on to where they belong. */
export default function GuestRoute() {
  const [searchParams] = useSearchParams()
  const status = useAuthStore((state) => state.status)
  const capabilities = useAuthStore((state) => state.capabilities)

  if (status === 'idle' || status === 'loading') return <FullPageLoader />

  if (status === 'authenticated') {
    const destination = getSafeReturnTo(searchParams.get('returnTo')) ?? getHomePath(capabilities)
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
