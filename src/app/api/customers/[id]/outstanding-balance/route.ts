import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id: customer_id } = params;

  if (!customer_id) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('total, status')
      .eq('customer_id', customer_id)
      .in('status', ['sent', 'overdue', 'draft']); // Statuses considered "unpaid"

    if (error) {
      throw error;
    }

    const outstanding_balance = data.reduce((acc, invoice) => acc + (invoice.total || 0), 0);

    return NextResponse.json({ outstanding_balance });

  } catch (error: any) {
    console.error('Error fetching outstanding balance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
