import { RouterProvider } from 'react-router'

import { Toaster } from '@/components/ui/sonner'
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap'
import { router } from '@/router'

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthBootstrap>
  )
}
