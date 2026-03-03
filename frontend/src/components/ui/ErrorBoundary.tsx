'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  name?: string // Name of the component/section for better error tracking
  level?: 'page' | 'section' | 'component' // Error boundary level
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
  retryCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = []

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return { 
      hasError: true, 
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { name = 'Unknown', onError } = this.props
    
    // Enhanced error logging
    const errorData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      context: {
        component: name,
        level: this.props.level || 'component',
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      },
      errorId: this.state.errorId,
    }

    console.error(`[ErrorBoundary:${name}] Component error caught:`, errorData)

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // Report to external error service (e.g., Sentry, LogRocket)
    this.reportError(errorData)

    // Update state with error info
    this.setState({ errorInfo })
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(clearTimeout)
  }

  private reportError = async (errorData: any) => {
    try {
      // Report to backend error logging endpoint
      if (typeof window !== 'undefined') {
        await fetch('/api/errors/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorData),
        }).catch(() => {
          // Silently fail if error reporting fails
          console.warn('Failed to report error to backend')
        })
      }
    } catch (e) {
      console.warn('Error reporting failed:', e)
    }
  }

  private handleRetry = () => {
    const maxRetries = 3
    if (this.state.retryCount >= maxRetries) {
      console.warn('Max retry attempts reached')
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }))

    // Set a timeout to reset retry count after successful recovery
    const timeout = setTimeout(() => {
      this.setState({ retryCount: 0 })
    }, 30000) // Reset after 30 seconds

    this.retryTimeouts.push(timeout)
  }

  private copyErrorDetails = () => {
    if (!this.state.error) return

    const errorDetails = {
      error: this.state.error.toString(),
      stack: this.state.error.stack,
      errorInfo: this.state.errorInfo,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        console.log('Error details copied to clipboard')
        // Could show a toast notification here
      })
      .catch(() => {
        console.warn('Failed to copy error details')
      })
  }

  private renderMinimalError = () => (
    <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
      <span className="text-red-700 dark:text-red-400 text-sm">
        Something went wrong in this section
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={this.handleRetry}
        className="ml-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  )

  private renderFullError = () => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl mb-2">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription>
            {this.props.level === 'page' 
              ? "We're sorry for the inconvenience. The page encountered an unexpected error."
              : "This component encountered an error and couldn't render properly."
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error ID for support */}
          {this.state.errorId && (
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="font-mono text-xs">
                Error ID: {this.state.errorId}
              </Badge>
            </div>
          )}

          {/* Error details (collapsible) */}
          {this.state.error && (
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none bg-muted p-4 rounded-lg hover:bg-muted/80">
                <div className="flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Technical Details</span>
                </div>
                <div className="ml-2 transform group-open:rotate-180 transition-transform">
                  ▼
                </div>
              </summary>
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Error Message:</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </div>
                
                {this.state.error.stack && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Stack Trace:</h4>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={this.copyErrorDetails}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Details
                  </Button>
                </div>
              </div>
            </details>
          )}

          {/* Recovery actions */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={this.handleRetry}
              disabled={this.state.retryCount >= 3}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {this.state.retryCount >= 3 ? 'Max Retries' : `Try Again ${this.state.retryCount > 0 ? `(${this.state.retryCount}/3)` : ''}`}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            If the problem persists, please contact support with the error ID above.
          </div>
        </CardContent>
      </Card>
    </div>
  )

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Render different UIs based on error level
      switch (this.props.level) {
        case 'page':
          return this.renderFullError()
        case 'section':
          return this.renderFullError()
        case 'component':
        default:
          return this.renderMinimalError()
      }
    }

    return this.props.children
  }
}

// Specialized error boundaries for different use cases
export class PageErrorBoundary extends Component<Omit<Props, 'level'>, State> {
  render() {
    return (
      <ErrorBoundary {...this.props} level="page">
        {this.props.children}
      </ErrorBoundary>
    )
  }
}

export class SectionErrorBoundary extends Component<Omit<Props, 'level'>, State> {
  render() {
    return (
      <ErrorBoundary {...this.props} level="section">
        {this.props.children}
      </ErrorBoundary>
    )
  }
}

export class ComponentErrorBoundary extends Component<Omit<Props, 'level'>, State> {
  render() {
    return (
      <ErrorBoundary {...this.props} level="component">
        {this.props.children}
      </ErrorBoundary>
    )
  }
}
