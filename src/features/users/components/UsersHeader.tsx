import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface UsersHeaderProps {
  userCount: number
  onAddStaffUser: () => void
}

export function UsersHeader({ userCount, onAddStaffUser }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <Badge variant="secondary" aria-label={`${userCount} total users`}>
          {userCount}
        </Badge>
      </div>
      <Button type="button" onClick={onAddStaffUser}>
        Add staff user
      </Button>
    </div>
  )
}
