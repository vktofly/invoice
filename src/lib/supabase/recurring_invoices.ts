import { supabase } from './client';

export async function getRecurringInvoicesSummary() {
  
  const { data, error } = await supabase.rpc('get_recurring_invoices_summary');
  return { data, error };
}

export async function getRecurringInvoices() {
  
  const { data, error } = await supabase
    .from('recurring_invoices')
    .select('*');
  return { data, error };
}

export async function getRecurringInvoiceById(id: string) {
  
  const { data, error } = await supabase
    .from('recurring_invoices')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
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
