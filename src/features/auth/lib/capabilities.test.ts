import { describe, expect, it } from 'vitest'

import { getHomePath, getSafeReturnTo, hasCapability } from './capabilities'
import type { Capability } from '../types/auth.types'

const agentCaps: Capability[] = ['queue:view', 'tickets:triage', 'tickets:view-all']
const customerCaps: Capability[] = ['tickets:view-own', 'tickets:create']

describe('hasCapability', () => {
  it('checks a single required capability', () => {
    expect(hasCapability(agentCaps, 'queue:view')).toBe(true)
    expect(hasCapability(agentCaps, 'users:manage')).toBe(false)
  })

  it('requires every capability when given a list', () => {
    expect(hasCapability(agentCaps, ['queue:view', 'tickets:triage'])).toBe(true)
    expect(hasCapability(agentCaps, ['queue:view', 'users:manage'])).toBe(false)
  })

  it('is false when the user has no capabilities', () => {
    expect(hasCapability([], 'tickets:view-own')).toBe(false)
    expect(hasCapability([], [])).toBe(true)
  })
})

describe('getHomePath', () => {
  it('prefers the staff queue when available', () => {
    expect(getHomePath(agentCaps)).toBe('/queue')
    expect(getHomePath([...customerCaps, 'queue:view'])).toBe('/queue')
  })

  it('falls back to the customer tickets list', () => {
    expect(getHomePath(customerCaps)).toBe('/tickets')
  })

  it('returns null when nothing fits (avoids redirect loops to /)', () => {
    expect(getHomePath([])).toBeNull()
    expect(getHomePath(['users:manage'])).toBeNull()
  })
})

describe('getSafeReturnTo', () => {
  it('allows same-app absolute paths', () => {
    expect(getSafeReturnTo('/tickets/42')).toBe('/tickets/42')
    expect(getSafeReturnTo('/queue?status=open')).toBe('/queue?status=open')
  })

  it('rejects off-site and protocol-relative redirects', () => {
    expect(getSafeReturnTo('https://evil.example/phish')).toBeNull()
    expect(getSafeReturnTo('//evil.example')).toBeNull()
    expect(getSafeReturnTo('tickets')).toBeNull()
    expect(getSafeReturnTo('')).toBeNull()
    expect(getSafeReturnTo(null)).toBeNull()
  })
})
