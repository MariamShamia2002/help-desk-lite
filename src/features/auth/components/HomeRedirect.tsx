import { Navigate } from 'react-router'

import { getHomePath } from '../lib/capabilities'
import { useAuthStore } from '../store/authStore'

export function HomeRedirect() {
  const capabilities = useAuthStore((state) => state.capabilities)
  return <Navigate to={getHomePath(capabilities)} replace />
}
