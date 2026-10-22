import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { TicketEmptyState, TicketTable } from '../components/TicketTable'
import { TicketsHeader } from '../components/TicketsHeader'
import { TicketsToolbar } from '../components/TicketsToolbar'
import { useTicketFilters } from '../hooks/useTicketFilters'
import { useTickets } from '../hooks/useTickets'

export default function TicketsPage() {
  const filters = useTicketFilters()
  const { data, isLoading, error } = useTickets(filters.params)

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const ticketCount = data?.meta.total ?? 0

  return (
    <section className="flex flex-col gap-6">
      <TicketsHeader ticketCount={ticketCount} />

      <TicketsToolbar
        search={filters.search}
        status={filters.status}
        sort={filters.sort}
        onSearchChange={filters.setSearch}
        onStatusChange={filters.selectStatus}
        onSortChange={filters.selectSort}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load tickets. Please try again.</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading tickets...</div>
      )}

      {!isLoading && data && (
        <>
          {data.data.length === 0 ? (
            <TicketEmptyState hasSearch={Boolean(filters.debouncedSearch)} />
          ) : (
            <TicketTable tickets={data.data} />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={filters.page === 1} onClick={() => filters.setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => filters.setPage((p) => p + 1)}
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
