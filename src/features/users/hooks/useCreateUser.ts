import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createUser } from '../api/usersApi'
import type { CreateUserPayload, CreateUserResponse } from '../types/user.types'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation<CreateUserResponse, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
