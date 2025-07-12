import { supabase } from './client';

export async function getRecurringInvoicesSummary() {
  const { data, error } = await supabase.rpc('get_recurring_invoices_summary');

  if (error) {
    console.error('Error fetching recurring invoices summary:', error);
    return null;
  }
  return data[0];
}
