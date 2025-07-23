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

    const { error } = await supabase
      .from('customers')
      .update({ ...customerData })
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: `Failed to update customer: ${error.message}` }, { status: 400 });
    }

    return NextResponse.json({ message: 'Customer updated successfully' });

  } catch (e: any) {
    console.error('Error parsing request body or during update:', e);
    return NextResponse.json({ error: 'Invalid request data or server error.' }, { status: 500 });
  }
}
