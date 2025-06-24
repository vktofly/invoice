"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Metrics {
  total: number;
  paid: number;
  outstanding: number;
  overdue: number;
  revenue: number;
}

export default function DashboardStats() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    async function fetchData() {
      // naive aggregation; in real db you'd use group by in SQL or RPC
      const { data, error } = await supabase.from('invoices').select('status');
      if (error) return;
      const total = data.length;
      const paidRows = data.filter((i) => i.status === 'paid');
      const paid = paidRows.length;
      const overdue = data.filter((i) => i.status === 'overdue').length;
      const revenue = paidRows.reduce((sum: number, row: any) => sum + (row.total || 0), 0);
      const outstanding = data.filter((i) => i.status === 'sent' || i.status === 'overdue').length;
      setMetrics({ total, paid, outstanding, overdue, revenue });
    }
    fetchData();
  }, []);

  if (!metrics)
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <span className="text-sm text-gray-500">Loading metrics…</span>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card label="Total Invoices" value={metrics.total} />
      <Card label="Paid" value={metrics.paid} />
      <Card label="Outstanding" value={metrics.outstanding} />
      <Card label="Overdue" value={metrics.overdue} />
      <Card label="Total Revenue" value={metrics.revenue} currency />
    </div>
  );
}

function Card({ label, value, currency = false }: { label: string; value: number; currency?: boolean }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{currency ? `$${value.toFixed(2)}` : value}</p>
    </div>
  );
} 