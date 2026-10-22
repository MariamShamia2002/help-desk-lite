import { Link } from 'react-router'

import { Logo } from '@/components/shared/Logo'

import { AccountMenu } from './AccountMenu'

export default function Header() {
  return (
    <header className="border-b border-border bg-card ">
      <div className="mx-auto flex h-16 px-4 items-center justify-between">
        <Link to="/" aria-label="Helpdesk Lite home" >
          <Logo />
        </Link>
        <AccountMenu />
      </div>
    </header>
  )
}
