import { getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import RecurringInvoiceList from '@/components/recurring-invoices/RecurringInvoiceList';
import RecurringInvoicesPageSkeleton from '@/components/skeletons/RecurringInvoicesPageSkeleton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

async function getRecurringInvoices(supabase: any) {
  const { data, error } = await supabase
    .from('recurring_invoices')
    .select('*, customers(name)');
  
  if (error) {
    console.error('Error fetching recurring invoices:', error);
    return [];
  }
  return data;
}

export default async function RecurringInvoicesPage() {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor"];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const supabase = await getServerSupabase();
  const recurringInvoices = await getRecurringInvoices(supabase);

  if (!recurringInvoices) {
    return <RecurringInvoicesPageSkeleton />;
  }

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recurring Invoices</h1>
        <Link
          href="/recurring-invoices/new"
          className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Recurring Invoice
        </Link>
      </div>
      <RecurringInvoiceList recurringInvoices={recurringInvoices} />
    </div>
  );
}