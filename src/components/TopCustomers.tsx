"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Row {
  client_id: string;
  name: string;
  total: number;
}

export default function TopCustomers() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function load() {
      const { data: invoices } = await supabase
        .from('invoices')
        .select('client_id,total,status')
        .eq('status', 'paid');
      if (!invoices) return;

      const totals: Record<string, number> = {};
      invoices.forEach((inv: any) => {
        if (!inv.client_id) return;
        totals[inv.client_id] = (totals[inv.client_id] || 0) + (inv.total || 0);
      });

      const clientIds = Object.keys(totals);
      if (clientIds.length === 0) {
        setRows([]);
        return;
      }

      const { data: clients } = await supabase
        .from('clients')
        .select('id,name')
        .in('id', clientIds);
      if (!clients) return;

      const tableRows = clients.map((c: any) => ({ client_id: c.id, name: c.name, total: totals[c.id] || 0 }));
      tableRows.sort((a, b) => b.total - a.total);
      setRows(tableRows.slice(0, 5));
    }
    load();
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Top Customers</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="px-2 py-1">Client</th>
            <th className="px-2 py-1 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.client_id} className="border-t">
              <td className="px-2 py-2">{r.name}</td>
              <td className="px-2 py-2 text-right">${r.total.toFixed(2)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={2} className="px-2 py-4 text-center text-gray-500">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 