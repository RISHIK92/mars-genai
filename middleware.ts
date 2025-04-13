import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/', 'chat']
  const isPublicPath = publicPaths.includes(pathname)

  // If user is already logged in and tries to access auth pages, redirect to chat
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // Protected paths that require authentication
  const protectedPaths = ['/chat', '/profile', '/settings']
  const isProtectedPath = protectedPaths.includes(pathname)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 