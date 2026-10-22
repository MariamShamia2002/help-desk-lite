import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterSelectProps {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  prefix?: string
}

export function FilterSelect({ label, value, options, onChange, prefix }: FilterSelectProps) {
  const currentLabel = options.find((opt) => opt.value === value)?.label ?? value

  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        if (typeof next === 'string') onChange(next)
      }}
    >
      <SelectTrigger aria-label={label} className="min-w-36">
        <SelectValue>{prefix ? `${prefix}: ${currentLabel}` : currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
