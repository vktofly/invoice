import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const text = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    return new Response('Signature missing', { status: 400 });
  }

  // 1. Verify the webhook signature
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(text)
    .digest('hex');

  if (generatedSignature !== signature) {
    return new Response('Invalid signature', { status: 400 });
  }

  // 2. Process the event
  const event = JSON.parse(text);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    try {
      // 3. Find the invoice associated with this order
      const { data: invoice, error: findError } = await supabaseAdmin
        .from('invoices')
        .select('id')
        .eq('payment_gateway_order_id', orderId)
        .single();

      if (findError || !invoice) {
        console.error(`Webhook Error: Could not find invoice for order_id ${orderId}`);
        // Return 200 to Razorpay so it doesn't retry, as we can't fix this.
        return NextResponse.json({ received: true, message: 'Invoice not found' });
      }

      // 4. Update the invoice status to 'paid'
      const { error: updateError } = await supabaseAdmin
        .from('invoices')
        .update({
          status: 'paid',
          payment_gateway_payment_id: payment.id,
        })
        .eq('id', invoice.id);

      if (updateError) {
        console.error(`Webhook Error: Failed to update invoice ${invoice.id} to paid`, updateError);
        return new Response('Failed to update invoice', { status: 500 });
      }

      console.log(`Successfully marked invoice ${invoice.id} as paid.`);

    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
