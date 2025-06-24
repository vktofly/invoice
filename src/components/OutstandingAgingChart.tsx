"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OutstandingAgingChart() {
  const [values, setValues] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const { data, error } = await supabase
        .from('invoices')
        .select('total, due_date, issue_date, status')
        .in('status', ['sent', 'overdue']);
      if (error) return;
      const buckets = [0, 0, 0, 0];
      data.forEach((row: any) => {
        const dueDate = row.due_date ? new Date(row.due_date) : new Date(row.issue_date);
        const diffDays = Math.round((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        let idx = 3;
        if (diffDays <= 30) idx = 0;
        else if (diffDays <= 60) idx = 1;
        else if (diffDays <= 90) idx = 2;
        buckets[idx] += row.total || 0;
      });
      setValues(buckets);
    }
    fetchData();
  }, []);

  const data = {
    labels: ['0-30d', '31-60d', '61-90d', '90d+'],
    datasets: [
      {
        label: 'Outstanding ($)',
        data: values,
        backgroundColor: 'rgba(234, 88, 12, 0.6)',
      },
    ],
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Outstanding Aging</h2>
      <Bar data={data} height={120} />
    </div>
  );
} 