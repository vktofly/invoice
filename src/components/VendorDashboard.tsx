'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false });
const RevenueTrendChart = dynamic(() => import('./RevenueTrendChart'), { ssr: false });
const OutstandingAgingChart = dynamic(() => import('./OutstandingAgingChart'), { ssr: false });
const RecentInvoices = dynamic(() => import('./RecentInvoices'), { ssr: false });

export default function VendorDashboard() {
  return (
    <main className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/invoices/new"
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            New Invoice
          </Link>
          <Link
            href="/invoices"
            className="rounded border px-4 py-2 text-indigo-600 hover:bg-gray-50"
          >
            View Invoices
          </Link>
        </div>
      </div>

      <DashboardStats />
      <RevenueTrendChart />
      <OutstandingAgingChart />
      <RecentInvoices />
    </main>
  );
} 