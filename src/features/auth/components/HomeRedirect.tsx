import { Link, Navigate } from 'react-router'
import { Hourglass } from 'lucide-react'

import { FullPageStatus } from '@/components/shared/FullPageStatus'
import { Button } from '@/components/ui/button'

import { getHomePath } from '../lib/capabilities'
import { useAuthStore } from '../store/authStore'

export function HomeRedirect() {
  const capabilities = useAuthStore((state) => state.capabilities)
  const homePath = getHomePath(capabilities)

  if (homePath) return <Navigate to={homePath} replace />

  return (
    <FullPageStatus
      icon={<Hourglass className="size-8 text-muted-foreground" aria-hidden="true" />}
      title="No access yet"
      description="Your account doesn't have access to any pages yet. Ask an administrator to update your permissions."
      action={
        <Button variant="outline" nativeButton={false} render={<Link to="/account" />}>
          Go to account settings
        </Button>
      }
    />
  )
}
