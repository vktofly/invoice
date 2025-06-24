"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getPastMonths } from '@/lib/date';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RevenueTrendChart() {
  const [dataset, setDataset] = useState<number[]>([]);
  const labels = getPastMonths();

  useEffect(() => {
    async function fetchRevenue() {
      const since = new Date();
      since.setMonth(since.getMonth() - 11);
      since.setDate(1);

      // Fetch paid invoices in last 12 months
      const { data, error } = await supabase
        .from('invoices')
        .select('total, paid_at')
        .gte('paid_at', since.toISOString())
        .eq('status', 'paid');

      if (error) return;

      // Initialize revenue per month
      const revenues = Array(12).fill(0);
      data.forEach((row: any) => {
        const date = new Date(row.paid_at || row.created_at);
        const diffMonths = (date.getFullYear() - since.getFullYear()) * 12 + (date.getMonth() - since.getMonth());
        if (diffMonths >= 0 && diffMonths < 12) {
          revenues[diffMonths] += row.total || 0;
        }
      });
      setDataset(revenues);
    }
    fetchRevenue();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: dataset,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Revenue (Last 12 Months)</h2>
      <Line data={data} height={100} />
    </div>
  );
} 