import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { data: recurringInvoice, error: recurringInvoiceError } = await supabase
    .from('recurring_invoices')
    .select('*, customers(*), invoice_items(*), billing_address:customer_addresses!recurring_invoices_billing_address_id_fkey(*), shipping_address:customer_addresses!recurring_invoices_shipping_address_id_fkey(*)')
    .eq('id', id)
    .single();

  if (recurringInvoiceError) {
    console.error('Error fetching recurring invoice:', recurringInvoiceError);
    return NextResponse.json({ error: 'Failed to fetch recurring invoice.' }, { status: 500 });
  }

  if (!recurringInvoice) {
    return NextResponse.json({ error: 'Recurring invoice not found.' }, { status: 404 });
  }

  // TODO: Add authorization check to ensure the user owns this recurring invoice

  return NextResponse.json(recurringInvoice);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  
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

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // TODO: Add authorization check

  const { data: updatedRecurringInvoice, error: updateError } = await supabase
    .from('recurring_invoices')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating recurring invoice:', updateError);
    return NextResponse.json({ error: 'Failed to update recurring invoice.' }, { status: 500 });
  }

  return NextResponse.json(updatedRecurringInvoice);
}