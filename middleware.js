import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.live https://*.vercel-scripts.com",
    "script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live https://*.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss://ws-us3.pusher.com wss://*.pusher.com",
    "frame-src 'self' https://vercel.live",
    "worker-src 'self' blob:",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)
  response.headers.delete('X-Content-Security-Policy')
  response.headers.delete('Content-Security-Policy-Report-Only')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt).*)',
  ],
}
