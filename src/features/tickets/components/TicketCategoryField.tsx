import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { TICKET_CATEGORIES } from '../lib/ticketHelpers'
import type { TicketCategory } from '../types/ticket.types'

interface TicketCategoryFieldProps {
  id?: string
  value?: TicketCategory
  error?: string
  onChange: (category: TicketCategory) => void
}

export function TicketCategoryField({
  id = 'category',
  value,
  error,
  onChange,
}: TicketCategoryFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Category (optional)</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (typeof next === 'string') onChange(next as TicketCategory)
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent>
          {TICKET_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
