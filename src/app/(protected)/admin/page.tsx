import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import Link from 'next/link';
import { DashboardStats, RevenueTrendChart, OutstandingAgingChart, TopCustomers, TopProducts, RecentInvoices } from './AdminDashboard';

async function getOrganization(supabase: any, userId: string) {
  const { data: orgData, error: orgError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', userId)
    .single();

  if (orgError || !orgData.organization_id) {
    console.error('Error fetching user profile or organization link:', orgError);
    return null;
  }

  const { data: org, error: orgDetailsError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgData.organization_id)
    .single();

  if (orgDetailsError) {
    console.error('Error fetching organization details:', orgDetailsError);
    return null;
  }

  return org;
}

export default async function AdminDashboardPage() {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor"];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const supabase = await getServerSupabase();
  const user = await getUser();
  const organization = await getOrganization(supabase, user.id);

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {/* Quick links */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <AdminLink href="/(protected)/admin/users" label="Manage Users" />
        <AdminLink href="/(protected)/invoices" label="Manage Invoices" />
        <AdminLink href="/(protected)/admin/reports" label="Reports" />
        <AdminLink href="/(protected)/admin/settings" label="Settings" />
      </section>
      {organization && <DashboardStats organization={organization} />}
      <RevenueTrendChart />
      <OutstandingAgingChart />
      <TopCustomers />
      <TopProducts />
      <RecentInvoices />
    </main>
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