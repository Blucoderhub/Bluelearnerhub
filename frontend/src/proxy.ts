import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected route prefixes. Any path starting with these requires authentication.
 * The cookie presence check is a heuristic — full JWT validation happens in the
 * Express backend on every API call. This prevents unauthenticated crawlers and
 * direct URL access from receiving protected page HTML.
 *
 * NOTE: Next.js 16 renamed middleware.ts → proxy.ts (export function proxy).
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */
const PROTECTED_PREFIXES = [
  // Student routes
  '/student',
  '/daily-quiz',
  '/exercises',
  '/hackathons',
  '/qna',
  '/certificates',
  '/notebooks',
  '/dev',
  '/tutorials',
  '/learning-tracks',
  '/organizations',
  '/premium',
  '/ide',
  '/labs',
  '/ai-companion',
  '/courses',
  '/quiz',
  '/community',
  '/mentors',
  '/tools',
  // Mentor routes
  '/mentor',
  // Corporate routes
  '/corporate',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // OAuth callback must be reachable before cookies are set
  if (pathname.startsWith('/oauth/callback')) return NextResponse.next()

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (!isProtected) return NextResponse.next()

  // Check for accessToken cookie set by backend after successful authentication.
  // The real JWT (accessToken) lives on the Express domain as an HttpOnly signed
  // cookie and is validated server-side on every API call. This middleware is
  // only a UX guard to redirect unauthenticated users to login before they hit
  // protected page HTML.
  const accessToken = request.cookies.get('accessToken')?.value

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/student/:path*',
    '/daily-quiz/:path*',
    '/exercises/:path*',
    '/hackathons/:path*',
    '/qna/:path*',
    '/certificates/:path*',
    '/notebooks/:path*',
    '/dev/:path*',
    '/tutorials/:path*',
    '/learning-tracks/:path*',
    '/organizations/:path*',
    '/premium/:path*',
    '/ide/:path*',
    '/labs/:path*',
    '/ai-companion/:path*',
    '/courses/:path*',
    '/quiz/:path*',
    '/community/:path*',
    '/mentors/:path*',
    '/tools/:path*',
    '/mentor/:path*',
    '/corporate/:path*',
  ],
}
