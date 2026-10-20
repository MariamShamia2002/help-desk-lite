import { NavLink } from 'react-router'

import { hasCapability } from '@/features/auth/lib/capabilities'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Capability } from '@/features/auth/types/auth.types'
import { useQueueCounts } from '@/features/queue/hooks/useQueueCounts'
import { useTicketCounts } from '@/features/tickets/hooks/useTicketCounts'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  capability: Capability
  showCount?: boolean
  countType?: 'tickets' | 'queue' | 'myAssigned'
  /** Exact path match — needed so /tickets is not active on /tickets/new. */
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'My tickets',
    to: '/tickets',
    capability: 'tickets:view-own',
    showCount: true,
    countType: 'tickets',
    end: true,
  },
  { label: 'New ticket', to: '/tickets/new', capability: 'tickets:create' },
  { label: 'Queue', to: '/queue', capability: 'queue:view', showCount: true, countType: 'queue', end: true },
  { label: 'My assigned', to: '/queue/me', capability: 'queue:view', showCount: true, countType: 'myAssigned' },
]

export function AppSidebar() {
  const capabilities = useAuthStore((state) => state.capabilities)

  const { ticketCount } = useTicketCounts()
  const { queueCount, myAssignedCount } = useQueueCounts()

  const getCount = (item: NavItem) => {
    if (!item.showCount) return undefined

    switch (item.countType) {
      case 'tickets':
        return ticketCount
      case 'queue':
        return queueCount
      case 'myAssigned':
        return myAssignedCount
      default:
        return undefined
    }
  }

  const visibleItems = NAV_ITEMS.filter((item) => hasCapability(capabilities, item.capability))

  if (visibleItems.length === 0) return null

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-r border-border bg-sidebar px-3 py-6 text-sidebar-foreground">
      <nav className="flex flex-col gap-1" aria-label="Main">
        {visibleItems.map((item) => {
          const count = getCount(item)

          return (
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
              {count !== undefined && <span className="text-xs text-muted-foreground tabular-nums">{count}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
