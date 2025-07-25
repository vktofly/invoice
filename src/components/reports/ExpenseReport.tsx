
'use client';

import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Skeleton from '../Skeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseReportSkeleton = () => (
  <div className="p-6 bg-card rounded-lg border shadow-sm">
    <Skeleton className="h-7 w-1/3 mb-4" />
    <div className="max-w-md mx-auto">
      <Skeleton className="h-64 w-64 rounded-full mx-auto" />
    </div>
  </div>
);

export default function ExpenseReport() {
  const [expenseData, setExpenseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const data = {
    labels: ['Office Supplies', 'Travel', 'Software', 'Utilities'],
    datasets: [
      {
        data: [300, 500, 1000, 250],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: 'transparent',
      },
    ],
  };

  if (loading) return <ExpenseReportSkeleton />;

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-card-foreground">Expense Report</h2>
      <div className="max-w-md mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
}
