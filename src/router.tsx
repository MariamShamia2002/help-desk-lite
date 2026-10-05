import { createBrowserRouter } from 'react-router'

import NotFoundPage from '@/components/shared/NotFoundPage'
import HomePage from '@/features/home/pages/HomePage'
import AppLayout from '@/layout/AppLayout'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
