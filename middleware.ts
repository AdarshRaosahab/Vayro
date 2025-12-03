import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const url = request.nextUrl

    // Static assets (images, fonts, etc.) - Long cache
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    // Short links (redirects) - Short cache to allow for quick updates
    // Assuming short links are at root level like /abc12345
    if (url.pathname.match(/^\/[a-zA-Z0-9]{6,}$/) && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
        response.headers.set('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=59')
    }

    // API routes - No cache by default, specific routes can override
    if (url.pathname.startsWith('/api')) {
        response.headers.set('Cache-Control', 'no-store, max-age=0')
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
