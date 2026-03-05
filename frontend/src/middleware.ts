import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Basic middleware without NextAuth
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/student/:path*',
        '/candidate/:path*',
        '/corporate/:path*',
        '/admin/:path*',
        '/hr/:path*',
        '/faculty/:path*',
        '/institution/:path*',
        '/select-role',
    ],
};
