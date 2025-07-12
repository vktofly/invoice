import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { id: invoice_id } = params;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, payment_date, payment_method, notes } = await req.json();

  if (!amount || !payment_date || !payment_method) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 1. Insert the payment
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      invoice_id,
      amount,
      payment_date,
      payment_method,
      notes,
    })
    .select()
    .single();

  if (paymentError) {
    console.error('Error creating payment:', paymentError);
    return NextResponse.json({ error: 'Failed to record payment.' }, { status: 500 });
  }

  // 2. Log the activity
  const activityMessage = `Recorded a payment of ${amount} via ${payment_method}.`;
  await supabase.from('invoice_activity').insert({
    invoice_id,
    user_id: session.user.id,
    activity_type: 'payment_recorded',
    comments: activityMessage,
    payment_id: payment.id,
  });

  // The trigger `trigger_update_invoice_status` will handle updating the invoice status automatically.

  return NextResponse.json(payment);
}
