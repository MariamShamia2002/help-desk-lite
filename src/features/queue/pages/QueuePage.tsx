import { getErrorMessage } from '@/api/errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { QueueTable } from '../components/QueueTable'
import { QueueToolbar } from '../components/QueueToolbar'
import { useQueue } from '../hooks/useQueue'
import { useQueueFilters } from '../hooks/useQueueFilters'
import { useStaffAgents } from '../hooks/useStaffAgents'

interface QueuePageProps {
  /** Locks the list to the current user's assignments and hides the assignee filter. */
  lockedAssignee?: 'me'
}

export default function QueuePage({ lockedAssignee }: QueuePageProps) {
  const filters = useQueueFilters(lockedAssignee)
  const { data, isLoading, error } = useQueue(filters.params)
  const agentsQuery = useStaffAgents(filters.showAssigneeFilter)

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const ticketCount = data?.meta.total ?? 0
  const title = lockedAssignee === 'me' ? 'My assigned' : 'Queue'
  const hasFilters =
    Boolean(filters.debouncedSearch) ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all'

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold">{title}</h1>
        <Badge variant="secondary" className="tabular-nums">
          {ticketCount}
        </Badge>
      </div>

      <QueueToolbar
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        assignee={filters.assignee}
        showAssigneeFilter={filters.showAssigneeFilter}
        agents={agentsQuery.data ?? []}
        onSearchChange={filters.setSearch}
        onStatusChange={filters.selectStatus}
        onPriorityChange={filters.selectPriority}
        onAssigneeChange={filters.selectAssignee}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(error, 'Failed to load the queue. Please try again.')}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading tickets...</div>
      )}

      {!isLoading && data && data.data.length === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            {hasFilters ? 'No tickets match these filters.' : 'No tickets in the queue.'}
          </p>
          {hasFilters && (
            <Button variant="outline" className="mt-4 hover:bg-accent" onClick={filters.clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {!isLoading && data && data.data.length > 0 && (
        <>
          <QueueTable tickets={data.data} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => filters.setPage((page) => page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => filters.setPage((page) => page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
