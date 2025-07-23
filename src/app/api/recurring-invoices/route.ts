import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RecurringInvoiceSchema } from '@/lib/schemas';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = await createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request) {
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
  // ...rest of your handler logic
}

export async function POST(req: Request) {
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

  const body = await req.json();
  const result = RecurringInvoiceSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { 
    customer_id, 
    organization_id,
    recurring_frequency, 
    recurring_start_date, 
    recurring_end_date, 
    ...invoiceTemplate 
  } = result.data;

  const { data, error } = await supabaseAdmin
    .from('recurring_invoices')
    .insert([
      {
        user_id: user.id,
        organization_id: organization_id,
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