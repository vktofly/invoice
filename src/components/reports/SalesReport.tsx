
'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesReport() {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch sales data from your API
    const fetchSalesData = async () => {
      // const res = await fetch('/api/reports/sales');
      // const data = await res.json();
      // setSalesData(data);
      setLoading(false);
    };
    fetchSalesData();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 1900, 3000, 5000, 2300, 3200],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  if (loading) return <p>Loading sales report...</p>;

  return (
    <div className="p-6 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg dark:bg-gray-800/40 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Sales Report</h2>
      <Bar data={data} />
    </div>
  );
}
