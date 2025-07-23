
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
import Skeleton from '../Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesReportSkeleton = () => (
  <div className="p-6 bg-card rounded-lg border shadow-sm">
    <Skeleton className="h-7 w-1/3 mb-4" />
    <div className="w-full h-64">
      <Skeleton className="w-full h-full" />
    </div>
  </div>
);

export default function SalesReport() {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
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

  if (loading) return <SalesReportSkeleton />;

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-card-foreground">Sales Report</h2>
      <Bar data={data} />
    </div>
  );
}
