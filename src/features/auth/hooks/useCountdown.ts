import { useCallback, useEffect, useState } from 'react'

/** Seconds remaining until a deadline; used for the RATE_LIMITED lock. */
export function useCountdown() {
  const [deadline, setDeadline] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (deadline === null) return

    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemaining(seconds)
      if (seconds === 0) setDeadline(null)
    }

    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [deadline])

  const start = useCallback((seconds: number) => {
    setRemaining(seconds)
    setDeadline(Date.now() + seconds * 1000)
  }, [])

  return { remaining, start }
}
