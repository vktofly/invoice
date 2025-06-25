'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface InvoiceRow {
  id: string;
  number: number | null;
  status: string;
  total: number | null;
  pdf_url: string | null;
}

export default function CustomerDashboard() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('invoices')
        .select('id, number, status, total, pdf_url')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setRows(data as InvoiceRow[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-2xl font-semibold">My Invoices</h1>
      <table className="min-w-full bg-white shadow rounded text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2 text-right">Total</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((inv) => (
            <tr key={inv.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{inv.number || inv.id.substring(0, 8)}</td>
              <td className="px-4 py-2 capitalize">{inv.status}</td>
              <td className="px-4 py-2 text-right">
                {inv.total ? `$${inv.total.toFixed(2)}` : '—'}
              </td>
              <td className="px-4 py-2 space-x-2 text-center text-sm">
                {inv.status !== 'paid' && (
                  <button className="rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">
                    Pay
                  </button>
                )}
                {inv.pdf_url && (
                  <Link
                    href={inv.pdf_url}
                    target="_blank"
                    className="rounded border px-3 py-1 text-indigo-600 hover:bg-gray-50"
                  >
                    PDF
                  </Link>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                You have no invoices.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
} 