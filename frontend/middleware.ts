import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Public routes that dont need authentication
  const publicPaths = ['/login', '/home'];
  const isPublicPath = publicPaths.includes(path);

  // If user tries to access protected route without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to access login page
  if (isPublicPath && token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Validate token and check role DO I WANT THIS?
  if (token) {
    try {
      // Decode JWT and check the role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      // Role based access control
      if (path.startsWith('/admin-dashboard') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (path.startsWith('/staff-dashboard') && ![ 'STAFF'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (path.startsWith('/dog-owner-dashboard') && !['OWNER'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // If token is invalid, redirect to log in page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin-dashboard/:path*',
    '/staff-dashboard/:path*',
    '/dog-owner-dashboard/:path*',
    '/login',
    '/register',
  ],
};
