import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { id } = params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'sent' })
    .eq('id', id);

  if (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invoice sent successfully' });
}