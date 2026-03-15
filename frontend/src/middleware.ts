import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  // accessToken is an HttpOnly signed cookie set by the Express auth controller.
  // We check for its presence; actual JWT validation happens server-side in Express.
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
  ],
};
