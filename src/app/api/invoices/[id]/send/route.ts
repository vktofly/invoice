import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { id } = params;

  const today = new Date();
  const dueDate = new Date(today.setDate(today.getDate() + 30));

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'sent', due_date: dueDate.toISOString().split('T')[0] })
    .eq('id', id)
    .eq('owner', user.id);

  if (error) {
    console.error(`Error sending invoice ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invoice sent successfully' });
}
