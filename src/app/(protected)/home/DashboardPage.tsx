// This is a temporary, simplified component for debugging.

import { Suspense } from 'react';
import DashboardStats from '@/components/DashboardStats';
import { DashboardStatsSkeleton } from '@/components/skeletons/DashboardStatsSkeleton';
import { InvoiceStatusChart } from '@/components/InvoiceStatusChart';
import { InvoiceStatusChartSkeleton } from '@/components/skeletons/InvoiceStatusChartSkeleton';
import ModernRevenueChart from '@/components/ModernRevenueChart';

import { QuickActionsCard } from '@/components/QuickActionsCard';
import { QuickActionsCardSkeleton } from '@/components/skeletons/QuickActionsCardSkeleton';
import RecentInvoices from '@/components/RecentInvoices';
import { RecentInvoicesSkeleton } from '@/components/skeletons/RecentInvoicesSkeleton';
import TopCustomers from '@/components/TopCustomers';
import { TopCustomersSkeleton } from '@/components/skeletons/TopCustomersSkeleton';
import TotalReceivables from '@/components/TotalReceivables';
import { TotalReceivablesSkeleton } from '@/components/skeletons/TotalReceivablesSkeleton';
import TopExpensesCard from '@/components/TopExpensesCard';
import { TopExpensesCardSkeleton } from '@/components/skeletons/TopExpensesCardSkeleton';
import TopProducts from '@/components/TopProducts';
import { TopProductsSkeleton } from '@/components/skeletons/TopProductsSkeleton';
import ModernOutstandingAgingChart from '@/components/ModernOutstandingAgingChart';
import { ModernOutstandingAgingChartSkeleton } from '@/components/skeletons/ModernOutstandingAgingChartSkeleton';

export default function DashboardPage() {
  const mockOrganization = { name: 'Innovate Inc.' };
  const mockInvoiceStatusData = {
    draft: 15,
    sent: 45,
    paid: 250,
    overdue: 20,
  };

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        Dashboard
      </h1>
      <DashboardStats organization={mockOrganization} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ModernRevenueChart />
        </div>
        <div className="lg:col-span-2">
          <InvoiceStatusChart />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInvoices />
        </div>
        <QuickActionsCard />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TopCustomers />
        </div>
        <div className="lg:col-span-2">
          <TotalReceivables />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
        <div className="lg:col-span-1">
          <TopExpensesCard />
        </div>
        <div className="lg:col-span-2">
          <ModernOutstandingAgingChart />
        </div>
      </div>
    </div>
  );
}
