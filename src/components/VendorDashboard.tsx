'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false });
const RevenueTrendChart = dynamic(() => import('./RevenueTrendChart'), { ssr: false });
const OutstandingAgingChart = dynamic(() => import('./OutstandingAgingChart'), { ssr: false });
const RecentInvoices = dynamic(() => import('./RecentInvoices'), { ssr: false });
const TopCustomers = dynamic(() => import('./TopCustomers'), { ssr: false });
const TopProducts = dynamic(() => import('./TopProducts'), { ssr: false });

function HelpIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="relative group ml-1 align-middle">
      <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 inline" aria-label="Help" />
      <span className="absolute left-1/2 z-10 hidden w-40 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block group-focus:block">
        {tooltip}
      </span>
    </span>
  );
}

export default function VendorDashboard() {
  const [fiscalYear, setFiscalYear] = useState('This Fiscal Year');
  const fiscalYears = ['This Fiscal Year', 'Last Fiscal Year', 'Custom'];

  return (
    <main className="space-y-8 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/(protected)/invoices/new"
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            New Invoice
          </Link>
          <Link
            href="/(protected)/invoices"
            className="rounded border px-4 py-2 text-indigo-600 hover:bg-gray-50"
          >
            View Invoices
          </Link>
        </div>
      </div>

      {/* Total Receivables */}
      <section className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-semibold">Total Receivables</h2>
            <HelpIcon tooltip="Total amount you are yet to receive from customers." />
          </div>
          <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
            <span className="text-xl leading-none">+</span> New
          </button>
        </div>
        <div className="mb-2 text-2xl font-bold">₹0.00</div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500">CURRENT</span>
            <div className="font-semibold">₹0.00</div>
          </div>
          <div>
            <span className="text-red-500">OVERDUE</span>
            <div className="font-semibold">₹0.00</div>
            <div className="text-xs text-gray-400">1-15 Days</div>
          </div>
          <div>
            <span className="text-red-500 opacity-70"> </span>
            <div className="font-semibold">₹0.00</div>
            <div className="text-xs text-gray-400">16-30 Days</div>
          </div>
          <div>
            <span className="text-red-500 opacity-70"> </span>
            <div className="font-semibold">₹0.00</div>
            <div className="text-xs text-gray-400">31-45 Days</div>
          </div>
          <div>
            <span className="text-red-500 opacity-70"> </span>
            <div className="font-semibold">₹0.00</div>
            <div className="text-xs text-gray-400">Above 45 days</div>
          </div>
        </div>
      </section>

      <div className="my-4 border-t" />

      {/* Sales and Expenses with Fiscal Year Dropdown */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border bg-white p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h2 className="text-lg font-semibold">Sales and Expenses</h2>
              <HelpIcon tooltip="Track your sales and expenses trends." />
            </div>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={fiscalYear}
              onChange={e => setFiscalYear(e.target.value)}
              aria-label="Select Fiscal Year"
            >
              {fiscalYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <RevenueTrendChart />
        </div>
        <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <h2 className="text-lg font-semibold">Outstanding Aging</h2>
            <HelpIcon tooltip="Breakdown of outstanding receivables by age." />
          </div>
          <OutstandingAgingChart />
        </div>
      </section>

      <div className="my-4 border-t" />

      {/* Projects and Top Expenses */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <h2 className="text-lg font-semibold">Projects</h2>
            <HelpIcon tooltip="Monitor your key projects here." />
          </div>
          <div className="text-blue-600 text-sm cursor-pointer">Add Project(s) to this watchlist</div>
          <div className="mt-4 text-gray-400">No projects yet.</div>
        </div>
        <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <h2 className="text-lg font-semibold">Top Expenses</h2>
            <HelpIcon tooltip="Your highest expense categories." />
          </div>
          <TopProducts />
        </div>
      </section>

      <RecentInvoices />

      {/* Floating Need Assistance Button */}
      <button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
        aria-label="Need Assistance?"
      >
        <span className="inline-block h-3 w-3 rounded-full bg-pink-400 animate-pulse" />
        <span className="font-medium text-indigo-700">Need Assistance?</span>
      </button>
    </main>
  );
} 