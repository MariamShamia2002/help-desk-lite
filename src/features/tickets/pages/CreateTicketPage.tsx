import { Link } from 'react-router'

import { CreateTicketForm } from '../components/CreateTicketForm'

export default function CreateTicketPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link to="/tickets" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to tickets
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold">New ticket</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what's happening. An agent will pick it up and reply here.
          </p>
        </div>

        <CreateTicketForm />
      </div>
    </section>
  )
}
