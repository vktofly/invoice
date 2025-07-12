
'use client';

import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseReport() {
  const [expenseData, setExpenseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch expense data from your API
    const fetchExpenseData = async () => {
      // const res = await fetch('/api/reports/expenses');
      // const data = await res.json();
      // setExpenseData(data);
      setLoading(false);
    };
    fetchExpenseData();
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
      },
    ],
  };

  if (loading) return <p>Loading expense report...</p>;

  return (
    <div className="p-6 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg dark:bg-gray-800/40 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Expense Report</h2>
      <div className="max-w-md mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
}
