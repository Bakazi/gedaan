import { NextResponse } from 'next/server'

/**
 * Middleware: Ensures Content-Security-Policy allows 'unsafe-eval'.
 *
 * This intercepts every response and sets a CSP header that explicitly
 * permits eval(), new Function(), and other dynamic code patterns used
 * by framer-motion and other animation libraries.
 *
 * If the hosting platform (e.g. Vercel) injects its own CSP header,
 * this middleware overrides it before the response reaches the client.
 */
export function middleware(request) {
  const response = NextResponse.next()

  // Set a comprehensive CSP that allows everything the app needs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https:",
    "frame-src 'self'",
    "worker-src 'self' blob:",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Also clear any X-Content-Security-Policy that might be set by the platform
  response.headers.delete('X-Content-Security-Policy')
  response.headers.delete('Content-Security-Policy-Report-Only')

  return response
}

// Run on all routes except static files and API internals
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt).*)',
  ],
}
