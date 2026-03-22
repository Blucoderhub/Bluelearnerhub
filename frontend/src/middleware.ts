import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected route prefixes. Any path starting with these requires authentication.
 * The cookie presence check is a heuristic — full JWT validation happens in the
 * Express backend on every API call. This prevents unauthenticated crawlers and
 * direct URL access from receiving protected page HTML.
 */
const PROTECTED_PREFIXES = [
  '/student',
  '/admin',
  '/mentor',
  '/teacher',
  '/corporate',
  '/hr',
  '/institution',
  '/candidate',
  // Student feature routes (not under /student/ prefix but require auth)
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
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  // OAuth callback must be reachable before cookies are set
  if (pathname.startsWith('/oauth/callback')) return NextResponse.next()

  if (!isProtected) return NextResponse.next()

  // accessToken is an HttpOnly signed cookie set by the Express auth controller.
  // We check for its presence; actual JWT validation happens server-side in Express.
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
    '/admin/:path*',
    '/mentor/:path*',
    '/teacher/:path*',
    '/corporate/:path*',
    '/hr/:path*',
    '/institution/:path*',
    '/candidate/:path*',
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
  ],
}
