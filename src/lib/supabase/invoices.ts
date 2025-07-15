import { supabase } from './client';

export async function createDraftInvoice(payload) {
  // TODO: implement
}

export async function updateInvoice(id, payload) {
  // TODO: implement
}

export async function changeStatus(id, newStatus, user) {
  // TODO: implement
}

export async function getInvoice(id) {
  // TODO: implement
}

export async function listInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      id,
      status,
      total,
      number,
      created_at,
      customers(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return data.map(invoice => ({
    id: invoice.id,
    status: invoice.status,
    amount: invoice.total,
    number: invoice.number,
    created_at: invoice.created_at,
    customer: invoice.customers && invoice.customers.length > 0 ? invoice.customers[0].name : 'Unknown',
  }));
}

export async function getNextInvoiceNumber() {
    const { data, error } = await supabase.rpc('get_next_invoice_number');

    if (error) {
        console.error('Error fetching next invoice number:', error);
        return null;
    }
    return data;
}
