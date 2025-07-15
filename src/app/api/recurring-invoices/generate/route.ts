import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getRecurringInvoiceById } from '@/lib/supabase/recurring_invoices';
import { getNextInvoiceNumber } from '@/lib/supabase/invoices';

export async function POST(request: NextRequest) {
  const { recurring_invoice_id } = await request.json();

  if (!recurring_invoice_id) {
    return NextResponse.json({ error: 'Recurring invoice ID is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const recurringInvoice = await getRecurringInvoiceById(recurring_invoice_id);

  if (!recurringInvoice) {
    return NextResponse.json({ error: 'Recurring invoice not found' }, { status: 404 });
  }

  const nextInvoiceNumber = await getNextInvoiceNumber();

  const newInvoice = {
    customer_id: recurringInvoice.customer_id,
    invoice_number: nextInvoiceNumber,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Assuming due in 30 days
    total_amount: recurringInvoice.total_amount,
    status: 'draft',
    recurring_invoice_id: recurringInvoice.id,
    // Copy other relevant fields from recurringInvoice
  };

  const { data: createdInvoice, error: createError } = await supabase
    .from('invoices')
    .insert(newInvoice)
    .select()
    .single();

  if (createError) {
    console.error('Error creating invoice:', createError);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }

  // Update next generation date
  const nextGenerationDate = new Date(recurringInvoice.next_generation_date);
  if (recurringInvoice.frequency === 'monthly') {
    nextGenerationDate.setMonth(nextGenerationDate.getMonth() + 1);
  } else if (recurringInvoice.frequency === 'weekly') {
    nextGenerationDate.setDate(nextGenerationDate.getDate() + 7);
  } else if (recurringInvoice.frequency === 'yearly') {
    nextGenerationDate.setFullYear(nextGenerationDate.getFullYear() + 1);
  }

  const { error: updateError } = await supabase
    .from('recurring_invoices')
    .update({ next_generation_date: nextGenerationDate.toISOString().split('T')[0] })
    .eq('id', recurringInvoice.id);

  if (updateError) {
    console.error('Error updating recurring invoice:', updateError);
    // Handle this error, maybe the invoice was created but the recurring one wasn't updated
  }

  return NextResponse.json(createdInvoice);
}