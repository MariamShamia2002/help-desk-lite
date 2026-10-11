import { Outlet } from 'react-router'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/authStore'

import Header from './Header'

export default function AppLayout() {
  const roleChanged = useAuthStore((state) => state.roleChanged)
  const dismissRoleChanged = useAuthStore((state) => state.dismissRoleChanged)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {roleChanged && (
          <Alert role="status" className="mb-6">
            <AlertDescription className="flex items-center justify-between gap-4">
              Your role was changed by an administrator. What you can see has been updated.
              <Button variant="outline" size="sm" onClick={dismissRoleChanged}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Outlet />
      </main>
    </div>
  )
}
