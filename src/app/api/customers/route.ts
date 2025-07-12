import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const {
    customer_type,
    salutation,
    first_name,
    last_name,
    company_name,
    display_name,
    currency,
    email,
    work_phone,
    mobile,
    billing_attention,
    billing_country,
    billing_address1,
    billing_address2,
    billing_city,
    billing_state,
    billing_pin,
    billing_phone,
    billing_fax,
    shipping_attention,
    shipping_country,
    shipping_address1,
    shipping_address2,
    shipping_city,
    shipping_state,
    shipping_pin,
    shipping_phone,
    shipping_fax,
  } = await req.json();
  
  if (!display_name || !email) {
    return NextResponse.json({ error: 'Display name and email are required' }, { status: 400 });
  }

  // Get the authenticated user
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Insert customer into the customers table
  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      user_id: user.id,
      customer_type,
      salutation,
      first_name,
      last_name,
      company_name,
      display_name,
      currency,
      email,
      work_phone,
      mobile,
      billing_attention,
      billing_country,
      billing_address1,
      billing_address2,
      billing_city,
      billing_state,
      billing_pin,
      billing_phone,
      billing_fax,
      shipping_attention,
      shipping_country,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state,
      shipping_pin,
      shipping_phone,
      shipping_fax,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ customer }, { status: 201 });
}

export async function GET() {
  // Get the authenticated user
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch customers from customers table for the current user
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .order('display_name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customers: customers || [] });
}