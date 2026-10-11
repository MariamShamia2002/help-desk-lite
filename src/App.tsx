import { RouterProvider } from 'react-router'

import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap'
import { router } from '@/router'

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  )
}
