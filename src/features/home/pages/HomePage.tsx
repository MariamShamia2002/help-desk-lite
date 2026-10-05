import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="font-heading text-3xl font-semibold">Welcome to Helpdesk Lite</h1>
      <p className="text-muted-foreground">The project is set up and ready for features.</p>
      <Button>Get started</Button>
    </section>
  )
}
