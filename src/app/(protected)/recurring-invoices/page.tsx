
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

import RecurringInvoicesPageSkeleton from '@/components/skeletons/RecurringInvoicesPageSkeleton';

interface RecurringInvoice {
  id: string;
  frequency: string;
  customer: {
    name: string;
  };
  next_generation_date: string;
  status: string;
}

export default function RecurringInvoicesPage() {
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecurringInvoices = async () => {
      const res = await fetch('/api/recurring-invoices');
      const data = await res.json();
      setRecurringInvoices(data || []);
      setLoading(false);
    };
    fetchRecurringInvoices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recurring Invoices</h1>
        <Link href="/recurring-invoices/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Recurring Invoice
        </Link>
      </div>

      {loading ? (
        <RecurringInvoicesPageSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recurringInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.next_generation_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/recurring-invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
