import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected route configurations
 * Maps route prefixes to required roles
 */
const PROTECTED_ROUTES = {
  // Student routes - requires authentication
  '/student/': ['STUDENT', 'ADMIN'],
  '/daily-quiz': ['STUDENT', 'ADMIN'],
  '/exercises': ['STUDENT', 'ADMIN'],
  '/tutorials': ['STUDENT', 'ADMIN'],
  '/notebooks': ['STUDENT', 'ADMIN'],
  '/ai-companion': ['STUDENT', 'ADMIN'],
  '/certificates': ['STUDENT', 'ADMIN'],
  '/courses': ['STUDENT', 'ADMIN'],
  '/labs': ['STUDENT', 'ADMIN'],
  '/ide': ['STUDENT', 'ADMIN'],
  '/community': ['STUDENT', 'ADMIN'],
  '/premium': ['STUDENT', 'ADMIN'],

  // Mentor routes
  '/mentor/': ['FACULTY', 'ADMIN'],
  '/teacher/': ['FACULTY', 'ADMIN'],

  // Admin routes
  '/admin/': ['ADMIN'],

  // Corporate routes
  '/corporate/': ['CORPORATE', 'ADMIN'],
  '/host-hackathon': ['CORPORATE', 'ADMIN'],
  '/post-job': ['CORPORATE', 'ADMIN'],
  '/candidates': ['CORPORATE', 'ADMIN'],

  // HR routes
  '/hr/': ['HR', 'ADMIN'],

  // Institution routes
  '/institution/': ['INSTITUTION', 'ADMIN'],

  // Candidate routes
  '/candidate/': ['CANDIDATE', 'ADMIN'],
} as const

/**
 * Auth routes that should redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = [
  '/login',
  '/get-started',
  '/forgot-password',
  '/reset-password',
]

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/',
  '/contact',
  '/privacy',
  '/terms',
  '/spaces',
  '/hackathons',
  '/jobs',
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/og-image.png',
]

/**
 * Get the access token from cookies
 */
function getAccessToken(request: NextRequest): string | null {
  // Check for signed cookie first
  const accessToken = request.cookies.get('accessToken')?.value
  return accessToken || null
}

/**
 * Decode JWT token without verification (verification happens on backend)
 * This is just to check role for routing purposes
 */
function decodeToken(token: string): { role?: string; userId?: number } | null {
  try {
    // JWT tokens are base64 encoded in format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    return {
      role: payload.role,
      userId: payload.userId,
    }
  } catch {
    return null
  }
}

/**
 * Check if path matches any of the protected route patterns
 */
function getRequiredRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      return roles as string[]
    }
  }
  return null
}

/**
 * Check if path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  )
}

/**
 * Check if path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const token = getAccessToken(request)
  const decoded = token ? decodeToken(token) : null

  // Handle auth routes (login, get-started, etc.)
  // Redirect to dashboard if already authenticated
  if (isAuthRoute(pathname)) {
    if (token && decoded?.userId) {
      // Determine redirect based on role
      const role = decoded.role
      let redirectPath = '/student/dashboard'

      switch (role) {
        case 'ADMIN':
          redirectPath = '/admin/dashboard'
          break
        case 'FACULTY':
          redirectPath = '/mentor/dashboard'
          break
        case 'CORPORATE':
          redirectPath = '/corporate/dashboard'
          break
        case 'HR':
          redirectPath = '/hr/dashboard'
          break
        case 'INSTITUTION':
          redirectPath = '/institution/dashboard'
          break
        case 'CANDIDATE':
          redirectPath = '/candidate/dashboard'
          break
      }

      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.next()
  }

  // Check if route requires authentication
  const requiredRoles = getRequiredRoles(pathname)

  if (requiredRoles) {
    // Not authenticated - redirect to login
    if (!token || !decoded?.userId) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role authorization
    if (decoded.role && !requiredRoles.includes(decoded.role)) {
      // User is authenticated but doesn't have the right role
      // Redirect to their appropriate dashboard
      logger.warn(`Role mismatch: user with role ${decoded.role} tried to access ${pathname}`)

      let redirectPath = '/student/dashboard'
      switch (decoded.role) {
        case 'ADMIN':
          redirectPath = '/admin/dashboard'
          break
        case 'FACULTY':
          redirectPath = '/mentor/dashboard'
          break
        case 'CORPORATE':
          redirectPath = '/corporate/dashboard'
          break
        case 'HR':
          redirectPath = '/hr/dashboard'
          break
        case 'INSTITUTION':
          redirectPath = '/institution/dashboard'
          break
        case 'CANDIDATE':
          redirectPath = '/candidate/dashboard'
          break
      }

      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  return NextResponse.next()
}

// Simple logger for edge runtime
const logger = {
  warn: (message: string) => {
    console.warn(`[middleware] ${message}`)
  },
}

/**
 * Matcher configuration
 * Only run middleware on specific paths
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
