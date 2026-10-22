import { NavLink } from 'react-router'

import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Capability } from '@/features/auth/types/auth.types'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  capability: Capability
  showCount?: boolean
  /** Exact path match — needed so /tickets is not active on /tickets/new. */
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'My tickets', to: '/tickets', capability: 'tickets:view-own', showCount: true, end: true },
  { label: 'New ticket', to: '/tickets/new', capability: 'tickets:create' },
  { label: 'Queue', to: '/queue', capability: 'queue:view' },
]

export function AppSidebar() {
  const capabilities = useAuthStore((state) => state.capabilities)
  const canViewOwn = hasCapability(capabilities, 'tickets:view-own')

  const { data } = useTickets({ status: 'all', sort: 'desc', page: 1, limit: 1 }, { enabled: canViewOwn })
  const ticketCount = data?.meta.total

  const visibleItems = NAV_ITEMS.filter((item) => hasCapability(capabilities, item.capability))

  if (visibleItems.length === 0) return null

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-r border-border bg-sidebar px-3 py-6 text-sidebar-foreground">
      <nav className="flex flex-col gap-1" aria-label="Main">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-muted/40 hover:text-foreground',
              )
            }
          >
            <span className="flex-1">{item.label}</span>
            {item.showCount && ticketCount !== undefined && (
              <span className="text-xs text-muted-foreground tabular-nums">{ticketCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
