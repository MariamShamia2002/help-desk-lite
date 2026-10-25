import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUserStatus } from '../api/usersApi'
import type { AdminUser } from '../types/user.types'

interface UpdateUserStatusVariables {
  userId: string
  active: boolean
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation<AdminUser, Error, UpdateUserStatusVariables>({
    mutationFn: ({ userId, active }) => updateUserStatus(userId, { active }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
