import { Check, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

import { getPasswordStrength, PASSWORD_RULES, STRENGTH_LABELS } from '../lib/passwordStrength'

const BAR_COUNT = 4
/** From "Good" up, the password is accepted and the meter turns green. */
const STRONG_SCORE = 3

interface PasswordStrengthMeterProps {
  id: string
  password: string
}

export function PasswordStrengthMeter({ id, password }: PasswordStrengthMeterProps) {
  const { passed, score, level } = getPasswordStrength(password)
  const isStrong = score >= STRONG_SCORE

  return (
    <div id={id} className="flex flex-col gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full bg-border transition-colors',
              index < score && (isStrong ? 'bg-success' : 'bg-destructive'),
            )}
          />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {PASSWORD_RULES.map((rule) => {
          const met = passed[rule.id]
          const Icon = met ? Check : Circle
          return (
            <li key={rule.id} className={cn('flex items-start gap-1.5', met ? 'text-foreground' : 'text-muted-foreground')}>
              <Icon className={cn('mt-0.5 size-3.5 shrink-0', met && 'text-success')} aria-hidden="true" />
              <span>
                {rule.label}
                <span className="sr-only">{met ? ' (met)' : ' (not met)'}</span>
              </span>
            </li>
          )
        })}
      </ul>

      {password && (
        <p aria-live="polite" className={cn('text-sm font-medium', isStrong ? 'text-success' : 'text-destructive')}>
          Strength: {STRENGTH_LABELS[level]}
        </p>
      )}
    </div>
  )
}
