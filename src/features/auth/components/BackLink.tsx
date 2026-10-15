import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

interface BackLinkProps {
  to?: string
  children?: ReactNode
}

export function BackLink({ to = '/login', children = 'Back to sign in' }: BackLinkProps) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {children}
    </Link>
  )
}
