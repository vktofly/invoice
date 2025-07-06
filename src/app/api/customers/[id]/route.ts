import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();

  // Extract all updatable fields
  const updateData = {
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    country: data.country,
    gstin: data.gstin,
    name: data.name,
    email: data.email,
    customer_type: data.customer_type,
    salutation: data.salutation,
    first_name: data.first_name,
    last_name: data.last_name,
    company_name: data.company_name,
    display_name: data.display_name,
    currency: data.currency,
    work_phone: data.work_phone,
    mobile: data.mobile,
    pan: data.pan,
    payment_terms: data.payment_terms,
    portal_language: data.portal_language,
    billing_attention: data.billing_attention,
    billing_country: data.billing_country,
    billing_address1: data.billing_address1,
    billing_address2: data.billing_address2,
    billing_city: data.billing_city,
    billing_state: data.billing_state,
    billing_pin: data.billing_pin,
    billing_phone: data.billing_phone,
    billing_fax: data.billing_fax,
    shipping_attention: data.shipping_attention,
    shipping_country: data.shipping_country,
    shipping_address1: data.shipping_address1,
    shipping_address2: data.shipping_address2,
    shipping_city: data.shipping_city,
    shipping_state: data.shipping_state,
    shipping_pin: data.shipping_pin,
    shipping_phone: data.shipping_phone,
    shipping_fax: data.shipping_fax,
    website: data.website,
    department: data.department,
    designation: data.designation,
    twitter: data.twitter,
    skype: data.skype,
    facebook: data.facebook
  };

  // Get the authenticated user
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Update customer - RLS will ensure user can only update their own customers
  const { data: customer, error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id) // Use UUID string directly as text
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  // Get the authenticated user
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  // Delete customer - RLS will ensure user can only delete their own customers
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
