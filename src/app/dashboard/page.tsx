import dynamic from 'next/dynamic';

const DashboardStats = dynamic(() => import('@/components/DashboardStats'), { ssr: false });
const RevenueTrendChart = dynamic(() => import('@/components/RevenueTrendChart'), { ssr: false });
const OutstandingAgingChart = dynamic(() => import('@/components/OutstandingAgingChart'), { ssr: false });
const TopCustomers = dynamic(() => import('@/components/TopCustomers'), { ssr: false });
const TopProducts = dynamic(() => import('@/components/TopProducts'), { ssr: false });
const RecentInvoices = dynamic(() => import('@/components/RecentInvoices'), { ssr: false });

export default function DashboardPage() {
  return (
    <main className="space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardStats />
      <RevenueTrendChart />
      <OutstandingAgingChart />
      <TopCustomers />
      <TopProducts />
      <RecentInvoices />
    </main>
  );
} 