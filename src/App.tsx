import { RouterProvider } from 'react-router'

import { Toaster } from '@/components/ui/sonner'
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap'
import { DebugToolsDrawer } from '@/features/debug/components/DebugToolsDrawer'
import { router } from '@/router'

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      {import.meta.env.DEV ? <DebugToolsDrawer /> : null}
    </AuthBootstrap>
  )
}
