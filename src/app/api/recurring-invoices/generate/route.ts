
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST() {
  const { data: recurringInvoices, error } = await supabase
    .from('recurring_invoices')
    .select('*')
    .eq('status', 'active')
    .lte('next_generation_date', new Date().toISOString());

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  for (const recurring of recurringInvoices) {
    // 1. Generate the new invoice from the template
    const { error: insertError } = await supabase.from('invoices').insert([{
      user_id: recurring.user_id,
      organization_id: recurring.organization_id,
      customer_id: recurring.customer_id,
      ...recurring.invoice_template,
      status: 'draft',
    }]);

    if (insertError) {
      console.error('Failed to generate invoice:', insertError);
      continue; // Skip to the next one
    }

    // 2. Update the next generation date
    const nextDate = new Date(recurring.next_generation_date);
    if (recurring.frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
    if (recurring.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    if (recurring.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    if (recurring.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

    const { error: updateError } = await supabase
      .from('recurring_invoices')
      .update({ 
        last_generated_date: new Date().toISOString(),
        next_generation_date: nextDate.toISOString(),
        status: recurring.end_date && nextDate > new Date(recurring.end_date) ? 'finished' : 'active',
       })
      .eq('id', recurring.id);

    if (updateError) {
      console.error('Failed to update recurring invoice:', updateError);
    }
  }

  return new NextResponse(JSON.stringify({ message: `Generated ${recurringInvoices.length} invoices.` }), { status: 200 });
}
