import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="font-heading text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Button nativeButton={false} render={<Link to="/" />}>Back to home</Button>
    </section>
  )
}
