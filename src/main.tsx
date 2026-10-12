import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { isApiError } from '@/api/errors'

import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 4xx — only on transient errors (5xx, or status 0 for network failures)
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
