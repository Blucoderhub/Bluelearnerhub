import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Define role-to-path mappings
        const rolePaths: Record<string, string> = {
            STUDENT: '/student',
            CANDIDATE: '/candidate',
            CORPORATE: '/corporate',
            ADMIN: '/admin',
            HR: '/hr',
            FACULTY: '/faculty',
            INSTITUTION: '/institution',
        };

        // Check if user is accessing a role-protected route
        for (const [role, prefix] of Object.entries(rolePaths)) {
            if (path.startsWith(prefix)) {
                if (token?.role !== role) {
                    // Redirect to their own dashboard or select-role if they don't have access
                    const redirectTo = token?.role ? rolePaths[token.role as string] + '/dashboard' : '/select-role';
                    return NextResponse.redirect(new URL(redirectTo, req.url));
                }
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

// Match all protected routes
export const config = {
    runtime: 'nodejs',
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
