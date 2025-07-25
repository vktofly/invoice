import { Invoice, InvoiceItem } from '@/lib/types';
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

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(*),
      billing_address:customer_addresses!invoices_billing_address_id_fkey(*),
      shipping_address:customer_addresses!invoices_shipping_address_id_fkey(*),
      invoice_items:invoice_items(*)
    `)
    .eq('id', id)
    .single();

  if (invoiceError) {
    console.error('Error fetching invoice:', invoiceError);
    return NextResponse.json({ error: 'Failed to fetch invoice.' }, { status: 500 });
  }

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  // Authorization Check
  if (invoice.owner !== user.id) {
    // Also check if user is a customer for this invoice
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', invoice.customer_id)
      .single();

    if (customerError || !customer || customer.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  
  const responsePayload = { ...invoice };

  if (typeof responsePayload.custom_fields === 'string') {
    try {
      responsePayload.custom_fields = JSON.parse(responsePayload.custom_fields);
    } catch (e) {
      console.error('Failed to parse custom_fields:', e);
      responsePayload.custom_fields = [];
    }
  }

  return NextResponse.json(responsePayload);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { items = [], organization_id, ...invoiceData } = body as { items?: InvoiceItem[], organization_id: string } & Partial<Invoice>;

  if (!organization_id) {
    return NextResponse.json({ error: 'Organization ID is required.' }, { status: 400 });
  }

  const {
    discount_type,
    discount_amount,
    shipping_method,
    tracking_number,
    shipping_cost,
    custom_fields,
    ...restOfInvoiceData
  } = invoiceData;

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

  // Authorization: Check if the user belongs to the organization
  const { data: orgUser, error: orgUserError } = await supabase
    .from('organization_users')
    .select('user_id')
    .eq('org_id', organization_id)
    .eq('user_id', user.id)
    .single();

  if (orgUserError || !orgUser) {
    return NextResponse.json({ error: 'Forbidden: You do not have access to this organization.' }, { status: 403 });
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

  let processed_custom_fields = custom_fields;
  if (typeof processed_custom_fields === 'string') {
    try {
      processed_custom_fields = JSON.parse(processed_custom_fields);
    } catch (e) {
      console.error('Failed to parse custom_fields on update:', e);
      processed_custom_fields = [];
    }
  } else if (!Array.isArray(processed_custom_fields)) {
    processed_custom_fields = [];
  }

  const updatePayload: any = {
    ...restOfInvoiceData,
    organization_id,
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
    custom_fields: processed_custom_fields,
  };

  // Remove fields that should not be directly updated
  delete updatePayload.billing_address;
  delete updatePayload.shipping_address;
  delete updatePayload.customer; // Don't update customer relation directly
  


  // Update the invoice
  const { data: updatedInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .update(updatePayload)
    .eq('id', id)
    .eq('organization_id', organization_id) // Ensure user can only update their own invoice
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
      discount_type: item.discount_type,
      discount_amount: item.discount_amount,
      line_total: item.quantity * item.unit_price * (1 + item.tax_rate / 100), // This should be calculated properly
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

export async function DELETE(
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

  // Optional: Check if the invoice exists and belongs to the user
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('id, owner')
    .eq('id', id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  if (invoice.owner !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Delete related invoice items first (if you want to avoid orphaned rows)
  await supabase.from('invoice_items').delete().eq('invoice_id', id);

  // Delete the invoice
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('owner', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete invoice.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}