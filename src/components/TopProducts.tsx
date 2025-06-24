"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Row {
  description: string;
  total: number;
}

export default function TopProducts() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function load() {
      const { data: items } = await supabase
        .from('invoice_items')
        .select('description,line_total');
      if (!items) return;
      const totals: Record<string, number> = {};
      items.forEach((item: any) => {
        const key = item.description || 'Unnamed';
        totals[key] = (totals[key] || 0) + (item.line_total || 0);
      });
      const tableRows = Object.entries(totals).map(([description, total]) => ({ description, total }));
      tableRows.sort((a, b) => b.total - a.total);
      setRows(tableRows.slice(0, 5));
    }
    load();
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Top Products / Services</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="px-2 py-1">Item</th>
            <th className="px-2 py-1 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.description} className="border-t">
              <td className="px-2 py-2">{r.description}</td>
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