import { getServerSupabase } from '@/lib/supabase/server-utils';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import GenerationHistory from '@/components/recurring-invoices/GenerationHistory';
import RecurringInvoiceActions from '@/components/recurring-invoices/RecurringInvoiceActions';
import { getInvoiceGenerationHistory } from '@/lib/supabase/recurring_invoices';

async function getRecurringInvoice(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('recurring_invoices')
    .select('*, customers(name)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export default async function RecurringInvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const recurringInvoice = await getRecurringInvoice(supabase, params.id);
  const invoices = recurringInvoice ? await getInvoiceGenerationHistory(params.id) : [];

  if (!recurringInvoice) {
    return <p>Recurring invoice not found.</p>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Edit Recurring Invoice for {recurringInvoice.customers?.name || 'Unknown Customer'}
        </h1>
        <RecurringInvoiceActions recurringInvoice={recurringInvoice} />
      </div>
      <InvoiceForm initialInvoice={recurringInvoice.invoice_template} />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Generation History</h2>
        <GenerationHistory invoices={invoices} />
      </div>
    </div>
  );
}