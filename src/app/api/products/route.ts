
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...body, user_id: session.user.id }])
    .select();

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

  return NextResponse.json(data[0]);
}


