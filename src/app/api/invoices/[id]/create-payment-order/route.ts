import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// import Razorpay from 'razorpay';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { id: invoiceId } = params;

  // 1. Fetch the invoice details
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('total_amount, currency, number')
    .eq('id', invoiceId)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  // Razorpay functionality is temporarily disabled due to placeholder credentials.
  // To enable, provide valid Razorpay keys in .env.local and uncomment the code below.

  /*
  // 2. Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // 3. Create a Razorpay order
  const options = {
    amount: Math.round(invoice.total_amount * 100), // Amount in the smallest currency unit (e.g., paise for INR)
    currency: invoice.currency.toUpperCase(),
    receipt: `receipt_invoice_${invoice.number}`,
    notes: {
      invoice_id: invoiceId,
      user_id: user.id,
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    // 4. Store the order ID in our database
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        payment_gateway: 'razorpay',
        payment_gateway_order_id: order.id,
      })
      .eq('id', invoiceId);

    if (updateError) {
      console.error('Failed to update invoice with order ID:', updateError);
      // Decide if we should still proceed or return an error
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order.' }, { status: 500 });
  }
  */

  // Return a dummy response since Razorpay is disabled
  return NextResponse.json({ message: 'Razorpay is currently disabled.' }, { status: 200 });
}
