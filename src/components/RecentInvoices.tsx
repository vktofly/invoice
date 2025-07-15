'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowDownTrayIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

type InvoiceRow = {
  id: string;
  number: number;
  status: string;
  total: number | null;
  created_at: string;
  customers: { name: string } | null;
};

export default function RecentInvoices() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);

  useEffect(() => {
    supabase
      .from('invoices')
      .select('*, customers(name)')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRows(data as InvoiceRow[]);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) {
        console.error('Error deleting invoice:', error);
      } else {
        setRows(rows.filter((row) => row.id !== id));
      }
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
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
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-2 py-2">
                <Link href={`/invoices/${row.id}`} className="text-indigo-600 underline">
                  {row.number}
                </Link>
              </td>
              <td className="px-2 py-2">{row.customers?.name || 'Unknown'}</td>
              <td className="px-2 py-2 capitalize">{row.status}</td>
              <td className="px-2 py-2 text-right">
                {row.total ? row.total.toFixed(2) : '—'}
              </td>
              <td className="px-2 py-2 text-center">
                <div className="flex justify-center space-x-2">
                  <Link href={`/invoices/${row.id}`} className="text-gray-500 hover:text-gray-700">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-2 py-4 text-center text-gray-500">
                No invoices yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}  