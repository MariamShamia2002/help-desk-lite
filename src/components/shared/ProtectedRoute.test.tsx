import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/auth/store/authStore'
import type { AuthStatus, Capability, SignOutReason } from '@/features/auth/types/auth.types'

import ProtectedRoute from './ProtectedRoute'

function setAuth(partial: {
  status: AuthStatus
  capabilities?: Capability[]
  signOutReason?: SignOutReason | null
}) {
  useAuthStore.setState({
    status: partial.status,
    capabilities: partial.capabilities ?? [],
    signOutReason: partial.signOutReason ?? null,
    user: null,
    roleChanged: false,
  })
}

function renderAt(
  path: string,
  options?: {
    capability?: Capability | Capability[]
  },
) {
  const router = createMemoryRouter(
    [
      {
        path: '/tickets',
        element: <ProtectedRoute capability={options?.capability} />,
        children: [{ index: true, element: <div>Protected content</div> }],
      },
      { path: '/login', element: <div>Login page</div> },
      { path: '/', element: <div>Home page</div> },
    ],
    { initialEntries: [path] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    setAuth({ status: 'idle' })
  })

  it.each(['idle', 'loading'] as const)('shows the full-page loader while status is %s', (status) => {
    setAuth({ status })
    renderAt('/tickets')

    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('shows the deactivated account message', () => {
    setAuth({ status: 'deactivated' })
    renderAt('/tickets')

    expect(screen.getByRole('heading', { name: 'Your account has been deactivated' })).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('redirects to login with returnTo for a session that expired', async () => {
    setAuth({ status: 'unauthenticated', signOutReason: null })
    const router = renderAt('/tickets?q=open')

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.search).toBe(`?returnTo=${encodeURIComponent('/tickets?q=open')}`)
  })

  it.each(['manual', 'signed-out-everywhere'] as const)(
    'redirects to login without returnTo after %s sign-out',
    async (reason) => {
      setAuth({ status: 'unauthenticated', signOutReason: reason })
      const router = renderAt('/tickets')

      expect(await screen.findByText('Login page')).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/login')
      expect(router.state.location.search).toBe('')
    },
  )

  it('renders the outlet when authenticated with no capability gate', () => {
    setAuth({ status: 'authenticated', capabilities: ['tickets:view-own'] })
    renderAt('/tickets')

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('renders the outlet when the user has the required capability', () => {
    setAuth({ status: 'authenticated', capabilities: ['queue:view', 'tickets:triage'] })
    renderAt('/tickets', { capability: 'queue:view' })

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('shows access denied when a required capability is missing', () => {
    setAuth({ status: 'authenticated', capabilities: ['tickets:view-own'] })
    renderAt('/tickets', { capability: 'users:manage' })

    expect(screen.getByRole('heading', { name: "You don't have access to this page" })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to my home page' })).toHaveAttribute('href', '/')
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('requires every capability when given a list', () => {
    setAuth({ status: 'authenticated', capabilities: ['queue:view'] })
    renderAt('/tickets', { capability: ['queue:view', 'users:manage'] })

    expect(screen.getByRole('heading', { name: "You don't have access to this page" })).toBeInTheDocument()
  })
})
