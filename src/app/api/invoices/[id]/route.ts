import { Invoice, InvoiceItem } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Step 1: Fetch the core invoice data
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (invoiceError) {
    console.error('Error fetching core invoice:', invoiceError);
    return NextResponse.json({ error: 'Failed to fetch invoice.' }, { status: 500 });
  }

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  // Step 2: Authorization Check
  if (invoice.owner !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Step 3: Fetch related data in parallel
  const [
    { data: customer },
    { data: invoice_items },
    { data: billing_address },
    { data: shipping_address }
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', invoice.customer_id).single(),
    supabase.from('invoice_items').select('*').eq('invoice_id', id),
    invoice.billing_address_id ? supabase.from('customer_addresses').select('*').eq('id', invoice.billing_address_id).single() : Promise.resolve({ data: null }),
    invoice.shipping_address_id ? supabase.from('customer_addresses').select('*').eq('id', invoice.shipping_address_id).single() : Promise.resolve({ data: null })
  ]);

  // Step 4: Combine all data into a single response object
  const responsePayload = {
    ...invoice,
    customer,
    invoice_items: invoice_items || [],
    billing_address: billing_address,
    shipping_address: shipping_address
  };

  return NextResponse.json(responsePayload);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { items = [], ...invoiceData } = body as { items?: InvoiceItem[] } & Partial<Invoice>;

  const {
    discount_type,
    discount_amount,
    shipping_method,
    tracking_number,
    shipping_cost,
    custom_fields,
    ...restOfInvoiceData
  } = invoiceData;

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Recalculate totals on the server-side for security
  const subtotal = items.reduce((acc: number, item: any) => {
    const itemTotal = item.quantity * item.unit_price;
    let discount = 0;
    if (item.discount_type === 'percentage') {
      discount = itemTotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      discount = item.discount_amount || 0;
    }
    return acc + itemTotal - discount;
  }, 0);

  const tax_amount = items.reduce((acc: number, item: any) => {
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

  let total_amount = subtotal + tax_amount + (shipping_cost || 0);
  if (discount_type === 'percentage') {
    total_amount -= total_amount * ((discount_amount || 0) / 100);
  } else if (discount_type === 'fixed') {
    total_amount -= discount_amount || 0;
  }

  const updatePayload = {
    ...restOfInvoiceData,
    billing_address_id: restOfInvoiceData.billing_address_id || null,
    shipping_address_id: restOfInvoiceData.shipping_address_id || null,
    subtotal,
    tax_amount,
    total_amount,
    total: total_amount, // Ensure total is also updated
    updated_at: new Date().toISOString(),
    discount_type,
    discount_amount,
    shipping_method,
    tracking_number,
    shipping_cost,
    custom_fields,
  };

  // Remove fields that should not be directly updated
  delete updatePayload.billing_address;
  delete updatePayload.shipping_address;
  


  // Update the invoice
  const { data: updatedInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .update(updatePayload)
    .eq('id', id)
    .eq('owner', user.id) // Ensure user can only update their own invoice
    .select()
    .single();

  if (invoiceError) {
    console.error('Error updating invoice:', invoiceError);
    return NextResponse.json({ error: 'Failed to update invoice.' }, { status: 500 });
  }

  // Delete existing items for this invoice
  await supabase.from('invoice_items').delete().eq('invoice_id', id);

  // Insert the updated items
  if (items && items.length > 0) {
    const itemsPayload = items.map((item: any) => ({
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      line_total: item.quantity * item.unit_price * (1 + item.tax_rate / 100),
    }));
    
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsPayload);
    if (itemsError) {
        console.error('Error inserting invoice items:', itemsError);
        // Even if items fail, the main invoice was updated, so we don't want to return a 500 here
        // But we should log it. The client will be redirected, but this is a server issue.
    }
  }

  return NextResponse.json(updatedInvoice);
}