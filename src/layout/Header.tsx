import { LogOut } from 'lucide-react'
import { Link } from 'react-router'

import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/authStore'

export default function Header() {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label="Helpdesk Lite home">
          <Logo />
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => void signOut()}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
