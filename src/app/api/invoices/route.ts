import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { Invoice, InvoiceItem } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customer');

  const supabase = createRouteHandlerClient({
    cookies: () => cookies(),
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch invoices with all related data in a single query
  let invoiceQuery = supabase.from('invoices').select(`
    *,
    customer:customers (*),
    billing_address:customer_addresses!invoices_billing_address_id_fkey (*),
    shipping_address:customer_addresses!invoices_shipping_address_id_fkey (*),
    invoice_items (*)
  `);

  if (status) {
    invoiceQuery = invoiceQuery.eq('status', status);
  }
  if (customerId) {
    invoiceQuery = invoiceQuery.eq('customer_id', customerId);
  }
  
  const { data: invoices, error: invoiceError } = await invoiceQuery;

  if (invoiceError) {
    console.error("Error fetching invoices:", invoiceError.message);
    return NextResponse.json({ error: "Failed to fetch invoices: " + invoiceError.message }, { status: 500 });
  }

  return NextResponse.json(invoices || []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items = [], currency, ...invoiceData } = body as { items?: InvoiceItem[], currency?: string } & Partial<Invoice>;

  const {
    billing_address_id,
    shipping_address_id,
    billing_address,
    shipping_address,
    discount_type,
    discount_amount,
    shipping_method,
    tracking_number,
    shipping_cost,
    custom_fields,
    ...restOfInvoiceData
  } = invoiceData;

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

  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.unit_price;
    let discount = 0;
    if (item.discount_type === 'percentage') {
      discount = itemTotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      discount = item.discount_amount || 0;
    }
    return acc + itemTotal - discount;
  }, 0);

  const total_tax = items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.unit_price;
    let discount = 0;
    if (item.discount_type === 'percentage') {
      discount = itemTotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      discount = item.discount_amount || 0;
    }
    const taxableAmount = itemTotal - discount;
    return acc + (taxableAmount * (item.tax_rate / 100));
  }, 0);

  let calculated_total = subtotal + total_tax + (shipping_cost || 0);
  if (discount_type === 'percentage') {
    calculated_total -= calculated_total * ((discount_amount || 0) / 100);
  } else if (discount_type === 'fixed') {
    calculated_total -= discount_amount || 0;
  }

  const insertPayload = { 
    ...restOfInvoiceData, 
    number, 
    owner: user.id, 
    currency: currency || 'USD',
    billing_address_id,
    shipping_address_id,
    subtotal,
    tax_amount: total_tax,
    total_amount: calculated_total,
    total: calculated_total, // Explicitly set total to prevent not-null violation
    discount_type,
    discount_amount,
    shipping_method,
    tracking_number,
    shipping_cost,
    custom_fields,
  };

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

  // Create a notification for the new invoice
  const notificationPayload = {
    user_id: user.id,
    message: `New invoice #${invoice.number} has been created.`,
    link: `/invoices/${invoice.id}`,
  };
  await supabase.from('notifications').insert(notificationPayload);


  return NextResponse.json(invoice, { status: 201 });
}

type ItemPayload = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total?: number;
  discount_type?: 'percentage' | 'fixed';
  discount_amount?: number;
};