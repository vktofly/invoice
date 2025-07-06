import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const {
    name,
    email,
    allowLogin,
    customer_type,
    salutation,
    first_name,
    last_name,
    company_name,
    display_name,
    currency,
    work_phone,
    mobile,
    pan,
    payment_terms,
    portal_language,
    // Address fields
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
    // Other details
    website,
    department,
    designation,
    twitter,
    skype,
    facebook
  } = await req.json();
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Get the authenticated user
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let auth_user_id = null;
  if (allowLogin) {
    // Check if a Supabase Auth user exists for this email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();
    if (existingUser) {
      auth_user_id = existingUser.id;
    } else {
      // Create a new Supabase Auth user (send invite email)
      const { data: newUser, error: inviteError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (inviteError) {
        return NextResponse.json({ error: inviteError.message }, { status: 400 });
      }
      auth_user_id = newUser.user?.id;
    }
  }

  // Insert customer into the customers table
  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      name,
      email,
      user_id: user.id, // Use UUID string directly as text
      auth_user_id: auth_user_id || null,
      customer_type,
      salutation,
      first_name,
      last_name,
      company_name,
      display_name,
      currency,
      work_phone,
      mobile,
      pan,
      payment_terms,
      portal_language,
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
      website,
      department,
      designation,
      twitter,
      skype,
      facebook
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
    .eq('user_id', user.id) // Use UUID string directly as text
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customers: customers || [] });
}