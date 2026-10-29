import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { onSessionEvent } from '@/api/session'
import { DEBUG_SIGN_OUT_CHANNEL } from '@/features/debug/lib/debugArm'

import { useAuthStore } from '../store/authStore'

interface AuthBootstrapProps {
  children: ReactNode
}

/** Restores the session on boot and keeps the store in sync with API session events. */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const queryClient = useQueryClient()
  const initialize = useAuthStore((state) => state.initialize)
  const handleSessionEvent = useAuthStore((state) => state.handleSessionEvent)
  const endLocalSession = useAuthStore((state) => state.endLocalSession)

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

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const channel = new BroadcastChannel(DEBUG_SIGN_OUT_CHANNEL)
    channel.onmessage = () => {
      endLocalSession('revoked')
      queryClient.clear()
    }
    return () => channel.close()
  }, [endLocalSession, queryClient])

  return children
}
