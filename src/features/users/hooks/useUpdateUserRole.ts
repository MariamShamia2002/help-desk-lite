import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Role } from '@/api/types'

import { updateUserRole } from '../api/usersApi'
import type { AdminUser } from '../types/user.types'

interface UpdateUserRoleVariables {
  userId: string
  role: Role
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation<AdminUser, Error, UpdateUserRoleVariables>({
    mutationFn: ({ userId, role }) => updateUserRole(userId, { role }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
