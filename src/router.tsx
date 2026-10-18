import { createBrowserRouter } from 'react-router'

import GuestRoute from '@/components/shared/GuestRoute'
import NotFoundPage from '@/components/shared/NotFoundPage'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AccountSecurityPage from '@/features/account/pages/AccountSecurityPage'
import { HomeRedirect } from '@/features/auth/components/HomeRedirect'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import QueuePage from '@/features/queue/pages/QueuePage'
import CreateTicketPage from '@/features/tickets/pages/CreateTicketPage'
import TicketsPage from '@/features/tickets/pages/TicketsPage'
import AppLayout from '@/layout/AppLayout'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  // Not guest-only: the emailed link must work even if this browser is signed in.
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: '/account', element: <AccountSecurityPage /> },
          {
            element: <ProtectedRoute capability="tickets:view-own" />,
            children: [{ path: '/tickets', element: <TicketsPage /> }],
          },
          {
            element: <ProtectedRoute capability="tickets:create" />,
            children: [{ path: '/tickets/new', element: <CreateTicketPage /> }],
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
