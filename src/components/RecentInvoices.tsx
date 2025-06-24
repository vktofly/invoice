"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type InvoiceRow = {
  id: string;
  number: number;
  status: string;
  client_id: string | null;
  total: number | null;
  created_at: string;
};

export default function RecentInvoices() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);

  useEffect(() => {
    supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRows(data as InvoiceRow[]);
      });
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Recent Invoices</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1 text-right">Total</th>
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
              <td className="px-2 py-2 capitalize">{row.status}</td>
              <td className="px-2 py-2 text-right">
                {row.total ? row.total.toFixed(2) : '—'}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="px-2 py-4 text-center text-gray-500">
                No invoices yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 