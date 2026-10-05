import { Outlet } from 'react-router'

import Header from './Header'

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
