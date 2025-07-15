import { supabase } from './client';

export async function getRecurringInvoicesSummary() {
  const { data, error } = await supabase.rpc('get_recurring_invoices_summary');

  if (error) {
    console.error('Error fetching recurring invoices summary:', error);
    return null;
  }
  return data[0];
}

export async function getRecurringInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('recurring_invoices')
    .select('*, customers(*), invoice_items(*), billing_address:customer_addresses!recurring_invoices_billing_address_id_fkey(*), shipping_address:customer_addresses!recurring_invoices_shipping_address_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching recurring invoice:', error);
    return null;
  }
  return data;
}

export async function getInvoiceGenerationHistory(recurringInvoiceId: string) {
    const { data, error } = await supabase
        .from('invoice_generation_history')
        .select('*')
        .eq('recurring_invoice_id', recurringInvoiceId)
        .order('generated_at', { ascending: false });

    if (error) {
        console.error('Error fetching invoice generation history:', error);
        return [];
    }
    return data;
}
