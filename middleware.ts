import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (session) {
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return res;
  }

  // Unauthenticated users
  const publicPaths = ['/', '/login', '/register', '/reset-password', '/update-password'];
  if (publicPaths.includes(pathname) || pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.startsWith('/static/')) {
      return res;
  }

  // If trying to access a protected route, redirect to login
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/login';
  redirectUrl.searchParams.set('redirectedFrom', pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 