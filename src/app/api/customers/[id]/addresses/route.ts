import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// GET all addresses for a specific customer
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id: customer_id } = params;

  const { data: addresses, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customer_id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching customer addresses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ addresses });
}

// POST a new address for a specific customer
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id: customer_id } = params;

  try {
    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default_billing,
      is_default_shipping,
    } = await req.json();

    if (!address_line1 || !city || !state || !postal_code || !country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default_billing: is_default_billing || false,
        is_default_shipping: is_default_shipping || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting new address:', error);
      return NextResponse.json({ error: `Failed to add address: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ address: data }, { status: 201 });

  } catch (e: any) {
    console.error('Error parsing request body or during address insertion:', e);
    return NextResponse.json({ error: 'Invalid request data or server error.' }, { status: 500 });
  }
}
