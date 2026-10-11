export const MIN_PASSWORD_LENGTH = 8

export type PasswordRuleId = 'length' | 'case' | 'number' | 'symbol'

export interface PasswordRule {
  id: PasswordRuleId
  /** Same wording the server uses in `fields.password`. */
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= MIN_PASSWORD_LENGTH },
  { id: 'case', label: 'Upper- and lowercase letters', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'number', label: 'A number', test: (p) => /\d/.test(p) },
  { id: 'symbol', label: 'A symbol, like ! or #', test: (p) => /[^A-Za-z0-9\s]/.test(p) },
]

export type PasswordStrengthLevel = 'too-weak' | 'very-weak' | 'fair' | 'good' | 'very-strong'

export interface PasswordStrength {
  passed: Record<PasswordRuleId, boolean>
  /** Bars to fill (0–4). */
  score: number
  level: PasswordStrengthLevel
  /** Mirrors the server: length is required, plus at least 3 of the 4 rules. */
  isAcceptable: boolean
  missing: string[]
}

const LEVEL_BY_SCORE: readonly PasswordStrengthLevel[] = ['too-weak', 'very-weak', 'fair', 'good', 'very-strong']

export const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  'too-weak': 'Too weak',
  'very-weak': 'Very weak',
  fair: 'Fair',
  good: 'Good',
  'very-strong': 'Very strong',
}

/** Highest score a password can show while it's shorter than the required length. */
const MAX_SCORE_WITHOUT_LENGTH = 2

export function getPasswordStrength(password: string): PasswordStrength {
  const passed = Object.fromEntries(PASSWORD_RULES.map((rule) => [rule.id, rule.test(password)])) as Record<
    PasswordRuleId,
    boolean
  >
  const metCount = PASSWORD_RULES.filter((rule) => passed[rule.id]).length
  // "Good" must mean the server accepts it, so a short password never gets past "Fair".
  const score = passed.length ? metCount : Math.min(metCount, MAX_SCORE_WITHOUT_LENGTH)

  return {
    passed,
    score,
    level: LEVEL_BY_SCORE[score],
    isAcceptable: passed.length && metCount >= 3,
    missing: PASSWORD_RULES.filter((rule) => !passed[rule.id]).map((rule) => rule.label),
  }
}
