import { getInitials } from '@/lib/initials'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name: string | null | undefined
  className?: string
}

/** Decorative: always render the name as text next to it. */
export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
