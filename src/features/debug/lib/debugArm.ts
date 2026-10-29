export type DebugFailStatus = 401 | 403 | 404 | 500

export interface DebugArmState {
  delayMs?: number
  failStatus?: DebugFailStatus
}

const MAX_DELAY_MS = 10_000

let armed: DebugArmState | null = null
let simulateOffline = false

/** Arm delay/fail headers for the next non-auth, non-_debug API call only. */
export function armDebugRequest(next: DebugArmState): void {
  const delayMs =
    typeof next.delayMs === 'number' ? Math.min(Math.max(0, Math.floor(next.delayMs)), MAX_DELAY_MS) : undefined
  armed = {
    ...(delayMs !== undefined ? { delayMs } : {}),
    ...(next.failStatus !== undefined ? { failStatus: next.failStatus } : {}),
  }
}

export function peekDebugArm(): DebugArmState | null {
  return armed
}

export function clearDebugArm(): void {
  armed = null
}

/**
 * Returns one-shot debug headers for a normal API call, then clears the arm.
 * Returns null for /auth/* and /_debug/* (never attach there).
 */
export function consumeDebugHeaders(endpoint: string): Record<string, string> | null {
  if (endpoint.startsWith('/auth/') || endpoint.startsWith('/_debug/')) return null
  if (!armed) return null

  const headers: Record<string, string> = {}
  if (armed.delayMs !== undefined) headers['X-Debug-Delay'] = String(armed.delayMs)
  if (armed.failStatus !== undefined) headers['X-Debug-Fail'] = String(armed.failStatus)
  armed = null
  return Object.keys(headers).length > 0 ? headers : null
}

export function setDebugOffline(next: boolean): void {
  simulateOffline = next
}

export function isDebugOffline(): boolean {
  return simulateOffline
}

export const DEBUG_SIGN_OUT_CHANNEL = 'helpdesk-debug-sign-out'
