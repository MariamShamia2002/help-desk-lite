import type { ReactNode } from 'react'

interface AccountSectionProps {
  id: string
  title: string
  /** Shown at the top right of the card (e.g. "Sign out everywhere"). */
  action?: ReactNode
  children: ReactNode
}

export function AccountSection({ id, title, action, children }: AccountSectionProps) {
  const titleId = `${id}-title`

  return (
    <section aria-labelledby={titleId} className="rounded-xl border border-border bg-card p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 id={titleId} className="font-heading text-xl font-semibold text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
