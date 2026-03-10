import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected routes that require an authenticated session.
 * The middleware checks for a signed `accessToken` cookie set by the backend.
 * If it is absent the user is redirected to /login with a callbackUrl so
 * they are returned to their intended page after sign-in.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for the accessToken cookie (set as HttpOnly + Signed by Express backend)
    const accessToken =
        request.cookies.get('accessToken')?.value;

    // Unauthenticated → redirect to login, preserving intended destination
    if (!accessToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/student/:path*',
        '/candidate/:path*',
        '/corporate/:path*',
        '/admin/:path*',
        '/hr/:path*',
        '/mentor/:path*',
        '/institution/:path*',
    ],
};
