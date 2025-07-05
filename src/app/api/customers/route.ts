import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const { name, email, allowLogin } = await req.json();
  
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