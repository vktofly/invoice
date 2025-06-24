import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customer = searchParams.get('customer');

  const supabase = supabaseServer();
  let query = supabase.from('invoices').select('*');

  if (status) query = query.eq('status', status);
  if (customer) query = query.eq('customer_id', customer);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('invoices').insert(body).select('*');
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}