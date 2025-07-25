
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('time_entries')
    .insert([{ ...body, user_id: session.user.id }])
    .select();

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

  return NextResponse.json(data[0]);
}
