'use client';
import Link from 'next/link';
import { ArrowDownTrayIcon, TrashIcon, EyeIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { RecentInvoicesSkeleton } from './skeletons/RecentInvoicesSkeleton';
import EmptyState from './EmptyState';

type InvoiceRow = {
  id: string;
  number: number;
  status: string;
  total: number | null;
  created_at: string;
  customers: { name: string } | null;
};

async function fetchData() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 3500));
  return [
    {
      id: '1',
      number: 2024001,
      status: 'paid',
      total: 1500,
      created_at: '2024-07-15T10:00:00Z',
      customers: { name: 'Tech Corp' },
    },
    {
      id: '2',
      number: 2024002,
      status: 'pending',
      total: 2500,
      created_at: '2024-07-18T14:30:00Z',
      customers: { name: 'Innovate LLC' },
    },
    {
      id: '3',
      number: 2024003,
      status: 'overdue',
      total: 1200,
      created_at: '2024-06-20T11:00:00Z',
      customers: { name: 'Solutions Inc' },
    },
  ];
}

export default function RecentInvoices() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <RecentInvoicesSkeleton />;
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<DocumentPlusIcon className="h-10 w-10" />}
        title="No invoices yet"
        description="Create your first invoice to get started."
        action={{
          label: 'Create Invoice',
          onClick: () => console.log('Redirect to /invoices/new'), // Placeholder
        }}
      />
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <h2 className="text-lg font-semibold">Recent Invoices</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Customer</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1 text-right">Total</th>
            <th className="px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t">
              <td className="px-2 py-2">
                <Link href={`/invoices/${row.id}`} className="text-indigo-600 underline">
                  {row.number}
                </Link>
              </td>
              <td className="px-2 py-2">{row.customers?.name || 'Unknown'}</td>
              <td className="px-2 py-2 capitalize">{row.status}</td>
              <td className="px-2 py-2 text-right">{row.total ? row.total.toFixed(2) : '—'}</td>
              <td className="px-2 py-2 text-center">
                <div className="flex justify-center space-x-2">
                  <Link href={`/invoices/${row.id}`} className="text-gray-500 hover:text-gray-700">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}  