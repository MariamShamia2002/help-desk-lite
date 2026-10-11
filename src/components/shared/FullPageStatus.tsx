import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

interface FullPageStatusProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function FullPageStatus({ title, description, icon, action }: FullPageStatusProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      {icon}
      <h1 className="font-heading text-xl font-semibold text-foreground">{title}</h1>
      {description && <p className="max-w-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-svh items-center justify-center bg-background">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
