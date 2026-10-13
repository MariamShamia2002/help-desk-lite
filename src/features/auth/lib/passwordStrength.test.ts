import { describe, expect, it } from 'vitest'

import { getPasswordStrength } from './passwordStrength'

describe('getPasswordStrength', () => {
  it.each([
    ['Abcdefg1!', true, 'very-strong'],
    ['Abcdefg1', true, 'good'],
    ['Ab1!', false, 'fair'],
    ['abcdefg1', false, 'fair'],
    ['abcdefgh', false, 'very-weak'],
    ['', false, 'too-weak'],
  ] as const)('%j -> acceptable: %s, level: %s', (password, isAcceptable, level) => {
    const result = getPasswordStrength(password)

    expect(result.isAcceptable).toBe(isAcceptable)
    expect(result.level).toBe(level)
  })

  it('requires length even when the other three rules pass', () => {
    expect(getPasswordStrength('Ab1!').missing).toEqual(['At least 8 characters'])
  })

  it('lists missing rules in the same order and wording as the server', () => {
    expect(getPasswordStrength('aaaaaaaa').missing).toEqual([
      'Upper- and lowercase letters',
      'A number',
      'A symbol, like ! or #',
    ])
  })
})

describe('character rules (checked against the API)', () => {
  it.each([' ', '\t', '_', 'é', 'ع', '😀'])('counts %j as a symbol', (char) => {
    expect(getPasswordStrength(`aaaaaaa${char}`).passed.symbol).toBe(true)
  })

  it('does not count ASCII letters or digits as symbols', () => {
    expect(getPasswordStrength('Abcdefg1').passed.symbol).toBe(false)
  })

  it('only counts ASCII letters and digits for the case and number rules', () => {
    expect(getPasswordStrength('aaaaaaaÉ').passed.case).toBe(false)
    expect(getPasswordStrength('aaaaaaa٣').passed.number).toBe(false)
  })
})
