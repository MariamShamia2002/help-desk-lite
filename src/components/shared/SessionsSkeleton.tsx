import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SessionsSkeletonProps {
  rows?: number
  className?: string
  /** Tighter padding for dialogs. */
  compact?: boolean
}

export function SessionsSkeleton({ rows = 3, className, compact = false }: SessionsSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading sessions…">
      <ul className={cn('divide-y divide-border rounded-lg border border-border', className)}>
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className={cn('flex flex-col gap-2', compact ? 'px-4 py-3' : 'px-5 py-4')}>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
