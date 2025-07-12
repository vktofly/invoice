import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Clone the request URL so we can mutate it without mutating the original
  const url = req.nextUrl.clone();

  // Initialise Supabase client with the incoming cookie headers
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, force login on protected routes
  if (!session) {
    if (isProtectedPath(url.pathname)) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return res;
  }

  // Extract role from user metadata (or default to "user")
  const role = (session.user.user_metadata?.role as string) || 'user';

  // Authorise admin-only routes
  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect users based on role
  if (role === 'customer' && !url.pathname.startsWith('/customer')) {
    url.pathname = '/customer';
    return NextResponse.redirect(url);
  } else if (role === 'vendor' && !url.pathname.startsWith('/home')) {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return res;
}

// Only run middleware for these paths to keep it fast
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/customer/:path*', '/home/:path*'],
};

function isProtectedPath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/customer') || pathname.startsWith('/home');
} 