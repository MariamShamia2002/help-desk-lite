import { LifeBuoy } from 'lucide-react'
import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-semibold text-foreground">
          <LifeBuoy className="size-5 text-primary" aria-hidden="true" />
          Helpdesk Lite
        </Link>
      </div>
    </header>
  )
}
