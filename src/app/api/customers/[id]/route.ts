import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// GET a single customer by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ customer });
}

// UPDATE a customer by ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;
  
  try {
    const customerData = await req.json();

    // Prepare the parameters for the RPC call
    const rpcParams = {
      p_customer_id: id,
      p_customer_type: customerData.customer_type,
      p_salutation: customerData.salutation,
      p_first_name: customerData.first_name,
      p_last_name: customerData.last_name,
      p_company_name: customerData.company_name,
      p_display_name: customerData.display_name,
      p_currency: customerData.currency,
      p_email: customerData.email,
      p_work_phone: customerData.work_phone,
      p_mobile: customerData.mobile,
      p_gstin: customerData.gstin,
      p_pan: customerData.pan,
      p_payment_terms: customerData.payment_terms,
      p_website: customerData.website,
      p_billing_attention: customerData.billing_attention,
      p_billing_country: customerData.billing_country,
      p_billing_address1: customerData.billing_address1,
      p_billing_address2: customerData.billing_address2,
      p_billing_city: customerData.billing_city,
      p_billing_state: customerData.billing_state,
      p_billing_pin: customerData.billing_pin,
      p_billing_phone: customerData.billing_phone,
      p_billing_fax: customerData.billing_fax,
      p_shipping_attention: customerData.shipping_attention,
      p_shipping_country: customerData.shipping_country,
      p_shipping_address1: customerData.shipping_address1,
      p_shipping_address2: customerData.shipping_address2,
      p_shipping_city: customerData.shipping_city,
      p_shipping_state: customerData.shipping_state,
      p_shipping_pin: customerData.shipping_pin,
      p_shipping_phone: customerData.shipping_phone,
      p_shipping_fax: customerData.shipping_fax
    };

    // Call the PostgreSQL function
    const { error } = await supabase.rpc('update_customer_with_addresses', rpcParams);

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json({ error: `Failed to update customer: ${error.message}` }, { status: 400 });
    }

    // Since RPC doesn't return the updated record, we'll just return a success message
    // or fetch the customer data again if needed.
    return NextResponse.json({ message: 'Customer updated successfully' });

  } catch (e: any) {
    console.error('Error parsing request body or during update:', e);
    return NextResponse.json({ error: 'Invalid request data or server error.' }, { status: 500 });
  }
}
