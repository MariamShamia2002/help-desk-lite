import { Link } from 'react-router'

import { Logo } from '@/components/shared/Logo'

import { AccountMenu } from './AccountMenu'

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label="Helpdesk Lite home">
          <Logo />
        </Link>
        <AccountMenu />
      </div>
    </header>
  )
}
