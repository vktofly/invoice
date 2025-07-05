import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();

  // Only allow address fields to be updated
  const { address, city, state, zip, country, gstin } = data;

  // Convert empty strings to null for bigint fields
  const updateData = {
    address: address || null,
    city: city || null,
    state: state || null,
    zip: zip && zip.trim() !== '' ? parseInt(zip) : null, // Convert to bigint or null
    country: country || null,
    gstin: gstin && gstin.trim() !== '' ? parseInt(gstin) : null, // Convert to bigint or null
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
