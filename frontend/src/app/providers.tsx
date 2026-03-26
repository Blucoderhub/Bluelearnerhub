'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { useState } from 'react'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  )

  return (
    <AuthProvider>
      <ErrorBoundary
        name="App Root"
        level="page"
        onError={(error, errorInfo) => {
          // Log critical application errors
          console.error('[Critical App Error]', { error, errorInfo })

          // Report to analytics/monitoring service
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'exception', {
              description: error.toString(),
              fatal: true,
            })
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary name="Query Client Provider" level="section">
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <ErrorBoundary name="Theme Provider" level="section">
                {children}
                <Toaster position="top-right" theme="light" richColors />
              </ErrorBoundary>
            </ThemeProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </ErrorBoundary>
    </AuthProvider>
  )
}
