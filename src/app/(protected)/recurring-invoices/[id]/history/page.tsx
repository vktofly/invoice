'use client';

import { useEffect, useState } from 'react';
import { getInvoiceGenerationHistory } from '@/lib/supabase/recurring_invoices';
import { Invoice } from '@/lib/types';
import Link from 'next/link';

export default function GenerationHistoryPage({ params }: { params: { id: string } }) {
  const [history, setHistory] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getInvoiceGenerationHistory(params.id);
      setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Invoice Generation History</h1>
      {history.length === 0 ? (
        <p>No invoices have been generated from this recurring invoice yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {history.map((invoice) => (
            <li key={invoice.id} className="py-4">
              <Link href={`/invoices/${invoice.id}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    Invoice #{invoice.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-600">
                      Status: {invoice.status}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0 sm:ml-6">
                      Total: ${invoice.total_amount?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}