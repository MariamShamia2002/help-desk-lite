import { Skeleton } from '@/components/ui/skeleton'

export function TicketDetailSkeleton() {
  return (
    <section className="flex flex-col gap-6" role="status" aria-live="polite" aria-label="Loading ticket…">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4 max-w-xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ms-auto h-3 w-20" />
              </div>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
          <div className="rounded-lg border bg-card p-4">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        <div className="hidden flex-col gap-3 rounded-lg border bg-card p-4 lg:flex">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

    </section>
  )
}
