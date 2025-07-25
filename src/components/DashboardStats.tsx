'use client';
import { useEffect, useState } from 'react';
import { DashboardStatsSkeleton } from './skeletons/DashboardStatsSkeleton';

async function fetchData(organization: any) {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    totalRevenue: 12500.0,
    netIncome: 8500.0,
    totalClients: 78,
    pendingInvoices: 12,
  };
}

export default function DashboardStats({ organization }: { organization: any }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization) {
      fetchData(organization).then(data => {
        setData(data);
        setLoading(false);
      });
    }
  }, [organization]);

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  const stats = [
    { name: 'Total Revenue', value: `${data.totalRevenue.toLocaleString()}` },
    { name: 'Net Income', value: `${data.netIncome.toLocaleString()}` },
    { name: 'Total Clients', value: data.totalClients },
    { name: 'Pending Invoices', value: data.pendingInvoices },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <div
          key={stat.name}
          className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
