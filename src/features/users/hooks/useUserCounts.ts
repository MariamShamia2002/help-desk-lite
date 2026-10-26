import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { useUsers } from './useUsers'

export function useUserCounts() {
  const capabilities = useAuthStore((state) => state.capabilities)
  const canManageUsers = hasCapability(capabilities, 'users:manage')

  const { data } = useUsers(
    { role: 'all', status: 'all', page: 1, limit: 1 },
    { enabled: canManageUsers },
  )

  return {
    userCount: data?.meta.total,
  }
}
