import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET a single customer by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Re-throw the error to be caught by the outer try-catch block
      throw error;
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
    }

    return NextResponse.json({ customer });

  } catch (error: any) {
    console.error('[API CUSTOMER GET ERROR]', error);
    const errorMessage = error.message || 'An unexpected error occurred.';
    const errorStatus = error.status || 500;
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: errorStatus });
  }
}

// UPDATE a customer by ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const customerData = await req.json();

    const { error } = await supabaseAdmin
      .from('customers')
      .update(customerData)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Customer updated successfully' });

  } catch (error: any) {
    console.error('[API CUSTOMER PATCH ERROR]', error);
    const errorMessage = error.message || 'An unexpected error occurred.';
    const errorStatus = error.status || 500;
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: errorStatus });
  }
}
