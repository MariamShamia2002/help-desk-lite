import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'

import { useQueue } from './useQueue'

export function useQueueCounts() {
  const user = useAuthStore((state) => state.user)
  const capabilities = useAuthStore((state) => state.capabilities)
  const canViewQueue = hasCapability(capabilities, 'queue:view')

  const { data: queueData } = useQueue({ page: 1, limit: 1 }, { enabled: canViewQueue })

  const { data: myAssignedData } = useQueue(
    { page: 1, limit: 1, assignee: user?.id },
    { enabled: canViewQueue && !!user?.id },
  )

  return {
    queueCount: queueData?.meta.total,
    myAssignedCount: myAssignedData?.meta.total,
  }
}
