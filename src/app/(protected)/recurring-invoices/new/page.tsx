'use server';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { getServerSupabase } from '@/lib/supabase/server-utils';

async function getData() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: customers } = await supabase.from('customers').select('*');
  const { data: organization } = await supabase.from('organizations').select('*').single();

  return { user, customers, organization };
}

export default async function NewRecurringInvoicePage() {
  const { user, customers, organization } = await getData();

  return (
    <InvoiceForm
      initialInvoice={{}}
      user={user}
      customers={customers}
      organization={organization}
    />
  );
}