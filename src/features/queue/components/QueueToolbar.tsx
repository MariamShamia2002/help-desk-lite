import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { TICKET_STATUSES } from '@/features/tickets/lib/ticketHelpers'
import type { TicketPriority, TicketStatus } from '@/features/tickets/types/ticket.types'

import { FilterSelect } from './FilterSelect'
import type { QueueAssignee, StaffAgent } from '../types/queue.types'

const PRIORITY_FILTERS: { label: string; value: TicketPriority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

const ASSIGNEE_PRESETS: { label: string; value: QueueAssignee }[] = [
  { label: 'Me', value: 'me' },
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'All', value: 'all' },
]

interface QueueToolbarProps {
  search: string
  status: TicketStatus | 'all'
  priority: TicketPriority | 'all'
  assignee: QueueAssignee
  showAssigneeFilter: boolean
  agents: StaffAgent[]
  onSearchChange: (value: string) => void
  onStatusChange: (status: TicketStatus | 'all') => void
  onPriorityChange: (priority: TicketPriority | 'all') => void
  onAssigneeChange: (assignee: QueueAssignee) => void
}

export function QueueToolbar({
  search,
  status,
  priority,
  assignee,
  showAssigneeFilter,
  agents,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
}: QueueToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1 basis-48 sm:max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search by title or requester"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search by title or requester"
          className="pl-9"
        />
      </div>

      <FilterSelect
        label="Status"
        value={status}
        onChange={(value) => onStatusChange(value as TicketStatus | 'all')}
        options={TICKET_STATUSES.map((option) => ({ label: option.label, value: option.value }))}
        prefix="Status"
      />

      <FilterSelect
        label="Priority"
        value={priority}
        onChange={(value) => onPriorityChange(value as TicketPriority | 'all')}
        options={PRIORITY_FILTERS}
        prefix="Priority"
      />

      {showAssigneeFilter && (
        <FilterSelect
          label="Assignee"
          value={assignee}
          onChange={onAssigneeChange}
          options={[...ASSIGNEE_PRESETS, ...agents.map((agent) => ({ label: agent.name, value: agent.id }))]}
          prefix="Assignee"
        />
      )}
    </div>
  )
}
