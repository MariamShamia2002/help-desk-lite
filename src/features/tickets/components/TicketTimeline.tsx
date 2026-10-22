import { Lock } from 'lucide-react'

import { UserAvatar } from '@/components/shared/UserAvatar'
import { useAuthStore } from '@/features/auth/store/authStore'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from '../lib/ticketHelpers'
import type { TicketMessage } from '../types/ticket.types'

interface TicketTimelineProps {
  messages: TicketMessage[]
}

function formatAbsoluteTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isStaffAuthor(message: TicketMessage): boolean {
  return message.author.role === 'agent' || message.author.role === 'admin'
}

export function TicketTimeline({ messages }: TicketTimelineProps) {
  const currentUserId = useAuthStore((state) => state.user?.id)

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>
  }

  return (
    <ol className="flex flex-col gap-4" aria-label="Conversation">
      {messages.map((message) => {
        if (message.kind === 'system') {
          return (
            <li key={message.id} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="size-2 shrink-0 rounded-full bg-border" aria-hidden="true" />
              <span className="min-w-0 flex-1">{message.body}</span>
              <time className="shrink-0" dateTime={message.createdAt} title={formatAbsoluteTime(message.createdAt)}>
                {formatRelativeTime(message.createdAt)}
              </time>
            </li>
          )
        }

        const staff = isStaffAuthor(message)
        const isYou = message.author.id === currentUserId
        const isInternal = message.kind === 'internal'

        return (
          <li key={message.id} className="flex gap-3">
            <UserAvatar
              name={message.author.name}
              className={
                isInternal
                  ? 'bg-amber-200 text-amber-950'
                  : staff
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground text-background'
              }
            />
            <div
              className={cn(
                'min-w-0 flex-1 rounded-lg border px-4 py-3',
                isInternal
                  ? 'border-dashed border-amber-300 bg-amber-50'
                  : isYou
                    ? 'border-primary/20 bg-primary/10'
                    : 'border-border bg-card shadow-sm',
              )}
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium">{message.author.name}</span>
                {staff && !isInternal && (
                  <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    Support
                  </span>
                )}
                {isYou && <span className="text-sm text-muted-foreground">(You)</span>}
                {isInternal && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                    <Lock className="size-3" aria-hidden="true" />
                    Internal note
                  </span>
                )}
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={message.createdAt}
                  title={formatAbsoluteTime(message.createdAt)}
                >
                  {formatRelativeTime(message.createdAt)}
                </time>
              </div>
              <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">{message.body}</p>
              {isInternal && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-900/70">
                  <Lock className="size-3 shrink-0" aria-hidden="true" />
                  Only visible to staff
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
