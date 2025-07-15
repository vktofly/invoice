import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RecurringInvoiceSchema } from '@/lib/schemas';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const result = RecurringInvoiceSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { 
    customer_id, 
    recurring_frequency, 
    recurring_start_date, 
    recurring_end_date, 
    ...invoiceTemplate 
  } = result.data;

  // Fetch the user's organizations
  const { data: orgs, error: orgError } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('created_by', user.id)
    .limit(1);

  if (orgError || !orgs || orgs.length === 0) {
    return NextResponse.json({ error: 'Could not determine organization.' }, { status: 500 });
  }

  const organization_id = orgs[0].id;

  const { data, error } = await supabaseAdmin
    .from('recurring_invoices')
    .insert([
      {
        user_id: user.id,
        organization_id: organization_id, // Replace with actual org ID
        customer_id: customer_id,
        frequency: recurring_frequency,
        start_date: recurring_start_date,
        end_date: recurring_end_date,
        next_generation_date: recurring_start_date, // First invoice on start date
        status: 'active',
        invoice_template: invoiceTemplate,
      },
    ])
    .select();

  if (error) {
    console.error('Error creating recurring invoice:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}