'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import GenerationHistory from '@/components/recurring-invoices/GenerationHistory';
import RecurringInvoiceActions from '@/components/recurring-invoices/RecurringInvoiceActions';
import { getInvoiceGenerationHistory } from '@/lib/supabase/recurring_invoices';
import { Invoice } from '@/lib/types';

export default function RecurringInvoiceDetailPage({ params }: { params: { id: string } }) {
  const [recurringInvoice, setRecurringInvoice] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecurringInvoice = async () => {
      const { data, error } = await supabase
        .from('recurring_invoices')
        .select('*, customers(name)')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching recurring invoice:', error);
      } else {
        setRecurringInvoice(data);
        const history = await getInvoiceGenerationHistory(params.id);
        setInvoices(history);
      }
      setLoading(false);
    };

    fetchRecurringInvoice();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

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