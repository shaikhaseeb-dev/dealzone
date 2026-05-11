import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      // Preserve the original destination so we can redirect back after login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on admin routes — skip static files, API routes, _next
  matcher: ['/admin/:path*'],
};
