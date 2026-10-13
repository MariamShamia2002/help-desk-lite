export function Logo() {
  return (
    <span className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-md bg-foreground text-sm text-background"
      >
        h
      </span>
      <span>
        helpdesk<span className="font-normal text-muted-foreground">·lite</span>
      </span>
    </span>
  )
}
