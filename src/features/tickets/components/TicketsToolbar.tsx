import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { SORT_OPTIONS, TICKET_STATUSES } from '../lib/ticketHelpers'
import type { TicketStatus } from '../types/ticket.types'

interface TicketsToolbarProps {
  search: string
  status: TicketStatus | 'all'
  sort: 'asc' | 'desc'
  onSearchChange: (value: string) => void
  onStatusChange: (status: TicketStatus | 'all') => void
  onSortChange: (sort: 'asc' | 'desc') => void
}

export function TicketsToolbar({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: TicketsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1 basis-48 sm:max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {TICKET_STATUSES.map((option) => (
          <Button
            key={option.value}
            variant={status === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className="rounded-full"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="shrink-0 gap-2"
        aria-label={sort === 'desc' ? 'Sorted by newest updated. Click for oldest.' : 'Sorted by oldest updated. Click for newest.'}
        onClick={() => onSortChange(sort === 'desc' ? 'asc' : 'desc')}
      >
        {sort === 'desc' ? (
          <ArrowDownWideNarrow className="size-4" aria-hidden />
        ) : (
          <ArrowUpWideNarrow className="size-4" aria-hidden />
        )}
        {SORT_OPTIONS.find((option) => option.value === sort)?.label}
      </Button>
    </div>
  )
}
