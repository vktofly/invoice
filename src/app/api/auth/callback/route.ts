import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/post-login';

    if (code) {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options) {
              cookieStore.delete({ name, ...options });
            },
          },
        }
      );
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      
    }

    // If there's an error or no code, redirect to login with a message
    const error_description = 'The link is invalid or has expired. Please try again.';
    return NextResponse.redirect(
      `${origin}/login?error=Authentication+Failed&error_description=${encodeURIComponent(
        error_description
      )}`
    );
  } catch (error) {
    // Fallback error handling
    const { origin } = new URL(request.url);
    const error_description = 'An unexpected error occurred. Please try again.';
    return NextResponse.redirect(
        `${origin}/login?error=Authentication+Failed&error_description=${encodeURIComponent(
        error_description
      )}`
    );
  }
}


