import supabase from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customer = searchParams.get('customer');

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
  const { items = [], ...invoiceData } = body as { items?: ItemPayload[] } & Record<string, any>;

  // Use the authenticated client so we know who the user is
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user)
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );

  // If number is missing or empty, generate a new one
  let number = invoiceData.number;
  if (!number) {
    // Get the max number and increment (or use a sequence, or a UUID, etc.)
    const { data: maxData } = await supabase
      .from('invoices')
      .select('number')
      .order('number', { ascending: false })
      .limit(1);
    let nextNumber = 1;
    if (maxData && maxData.length > 0 && !isNaN(Number(maxData[0].number))) {
      nextNumber = Number(maxData[0].number) + 1;
    }
    number = String(nextNumber).padStart(5, '0'); // e.g., 00001, 00002
  }

  const insertPayload = { ...invoiceData, number, owner: user.id };

  const { data: invoiceRows, error } = await supabase
    .from('invoices')
    .insert(insertPayload)
    .select('*');

  if (error || !invoiceRows || invoiceRows.length === 0)
    return NextResponse.json({ error: error?.message || 'Failed to create' }, { status: 500 });

  const invoice = invoiceRows[0];

  // Insert items if provided
  if (items && items.length > 0) {
    const itemsPayload = items.map((item) => ({
      ...item,
      line_total:
        item.line_total ?? (item.quantity * item.unit_price * (1 + item.tax_rate / 100)),
      invoice_id: invoice.id,
    }));
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsPayload);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
  }

  return NextResponse.json(invoice, { status: 201 });
}

type ItemPayload = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total?: number;
};