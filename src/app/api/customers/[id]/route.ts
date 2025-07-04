import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();

  // Only allow address fields to be updated
  const { address, city, state, zip, country, gstin } = data;

  const { error } = await supabase
    .from('customers')
    .update({ address, city, state, zip, country, gstin })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
