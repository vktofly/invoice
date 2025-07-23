import { createClient } from './client';

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
  const supabase = await createClient();
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

export async function getInvoices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*');
  return { data, error };
}

// ... (imports and other functions)

export async function getNextInvoiceNumber() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_next_invoice_number');
  return { data, error };
}

export async function getRevenueTrend() {
  // This is a placeholder. In a real scenario, you would create an RPC
  // function in Supabase to aggregate monthly revenue data.
  // For now, we'll return mock data to get the UI working.
  const mockData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
    { name: 'Jul', revenue: 7000 },
  ];
  return { data: mockData, error: null };
}

