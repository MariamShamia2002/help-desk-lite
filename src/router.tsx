import { createBrowserRouter } from 'react-router'

import GuestRoute from '@/components/shared/GuestRoute'
import NotFoundPage from '@/components/shared/NotFoundPage'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import { HomeRedirect } from '@/features/auth/components/HomeRedirect'
import LoginPage from '@/features/auth/pages/LoginPage'
import QueuePage from '@/features/queue/pages/QueuePage'
import TicketsPage from '@/features/tickets/pages/TicketsPage'
import AppLayout from '@/layout/AppLayout'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          {
            element: <ProtectedRoute capability="tickets:view-own" />,
            children: [{ path: '/tickets', element: <TicketsPage /> }],
          },
          {
            element: <ProtectedRoute capability="queue:view" />,
            children: [{ path: '/queue', element: <QueuePage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
