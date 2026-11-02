import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TableSkeletonProps {
  columns: number
  rows?: number
  /** Screen-reader label for the loading region. */
  label?: string
}

export function TableSkeleton({ columns, rows = 6, label = 'Loading…' }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card" role="status" aria-live="polite" aria-label={label}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }, (_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row}>
              {Array.from({ length: columns }, (_, col) => (
                <TableCell key={col}>
                  <Skeleton className={col === 1 ? 'h-4 w-3/4' : 'h-4 w-20'} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="sr-only">{label}</span>
    </div>
  )
}
 