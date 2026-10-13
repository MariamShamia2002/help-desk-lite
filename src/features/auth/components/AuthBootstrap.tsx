import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { onSessionEvent } from '@/api/session'

import { useAuthStore } from '../store/authStore'

interface AuthBootstrapProps {
  children: ReactNode
}

/** Restores the session on boot and keeps the store in sync with API session events. */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const queryClient = useQueryClient()
  const initialize = useAuthStore((state) => state.initialize)
  const handleSessionEvent = useAuthStore((state) => state.handleSessionEvent)

  useEffect(() => {
    return onSessionEvent((event) => {
      handleSessionEvent(event)
      // Never leave one user's cached data around for the next one.
      if (event.type === 'signed-out' || event.type === 'deactivated') queryClient.clear()
      if (event.type === 'role-changed') void queryClient.invalidateQueries()
    })
  }, [handleSessionEvent, queryClient])

  useEffect(() => {
    void initialize()
  }, [initialize])

  return children
}
