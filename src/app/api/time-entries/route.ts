
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerComponentClient({ cookies });
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
  const supabase = createServerComponentClient({ cookies });
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
