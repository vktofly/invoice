import dynamic from 'next/dynamic';
import Link from 'next/link';
import RoleProtected from '@/components/RoleProtected';

const DashboardStats = dynamic(() => import('@/components/DashboardStats'), { ssr: false });
const RevenueTrendChart = dynamic(() => import('@/components/RevenueTrendChart'), { ssr: false });
const OutstandingAgingChart = dynamic(() => import('@/components/OutstandingAgingChart'), { ssr: false });
const TopCustomers = dynamic(() => import('@/components/TopCustomers'), { ssr: false });
const TopProducts = dynamic(() => import('@/components/TopProducts'), { ssr: false });
const RecentInvoices = dynamic(() => import('@/components/RecentInvoices'), { ssr: false });

export default function AdminDashboardPage() {
  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <main className="space-y-8 p-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        {/* Quick links */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <AdminLink href="/(protected)/admin/users" label="Manage Users" />
          <AdminLink href="/(protected)/invoices" label="Manage Invoices" />
          <AdminLink href="/(protected)/admin/reports" label="Reports" />
          <AdminLink href="/(protected)/admin/settings" label="Settings" />
        </section>

        <DashboardStats />
        <RevenueTrendChart />
        <OutstandingAgingChart />
        <TopCustomers />
        <TopProducts />
        <RecentInvoices />
      </main>
    </RoleProtected>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded border bg-white p-6 text-center text-indigo-600 hover:bg-gray-50 shadow-sm"
    >
      {label}
    </Link>
  );
} 