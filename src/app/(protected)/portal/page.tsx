import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import InvoiceListClient from '../invoices/InvoiceListClient'; // Re-use the existing client component

// This function fetches the logged-in user's role.
async function getUserRole(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (error || !data) return null;
  return data.role;
}

// This is the main server component for the customer portal page.
export default async function CustomerPortalPage() {
  const supabase = createSupabaseServerClient();

  // Fetch the user's role to ensure we render the correct UI.
  const userRole = await getUserRole(supabase);

  // Fetch only the invoices for the logged-in customer.
  // The RLS policy for customers ensures they only get their own invoices.
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*, customer:customers(*)')
    .order('issue_date', { ascending: false });

  if (error) {
    console.error('Error fetching customer invoices:', error);
    return <p className="text-red-500">Could not load invoices.</p>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Invoices</h1>
      <InvoiceListClient initialInvoices={invoices || []} userRole={userRole || 'customer'} />
    </div>
  );
}
