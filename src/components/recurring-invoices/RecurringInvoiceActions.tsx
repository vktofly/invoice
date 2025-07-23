'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RecurringInvoiceActions({ recurringInvoice }: { recurringInvoice: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const supabase = createClient();

  const updateStatus = async (status: 'active' | 'paused' | 'finished') => {
    setLoading(true);
    const { error } = await supabase
      .from('recurring_invoices')
      .update({ status })
      .eq('id', recurringInvoice.id);

    if (error) {
      console.error(`Error updating status to ${status}:`, error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const generateNow = async () => {
    setGenerating(true);
    const res = await fetch(`/api/recurring-invoices/${recurringInvoice.id}/generate`, {
      method: 'POST',
    });

    if (res.ok) {
      router.refresh();
    } else {
      console.error('Error generating invoice');
    }
    setGenerating(false);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      {recurringInvoice.status === 'active' && (
        <button onClick={() => updateStatus('paused')} disabled={loading} className="btn-secondary">
          Pause
        </button>
      )}
      {recurringInvoice.status === 'paused' && (
        <button onClick={() => updateStatus('active')} disabled={loading} className="btn-secondary">
          Resume
        </button>
      )}
      {recurringInvoice.status !== 'finished' && (
        <>
          <button onClick={generateNow} disabled={generating} className="btn-primary">
            {generating ? 'Generating...' : 'Generate Now'}
          </button>
          <button onClick={() => updateStatus('finished')} disabled={loading} className="btn-danger">
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
