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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // OAuth callback must be reachable before cookies are set
  if (pathname.startsWith('/oauth/callback')) return NextResponse.next()

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (!isProtected) return NextResponse.next()

  // auth_hint is a non-sensitive presence signal set by AuthContext on the
  // frontend (Vercel) domain after successful login.  The real JWT (accessToken)
  // lives on the Express/Render domain as an HttpOnly cookie and is validated
  // server-side on every API call — this middleware is only a UX guard.
  const authHint = request.cookies.get('auth_hint')?.value

  if (!authHint) {
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
