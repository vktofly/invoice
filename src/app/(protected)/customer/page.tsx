import { getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import CustomerListClient from './CustomerListClient';
import CustomerPageSkeleton from '@/components/skeletons/CustomerPageSkeleton';

async function getCustomers(supabase: any) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data;
}

export default async function CustomersPage() {
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
  const customers = await getCustomers(supabase);

  if (!customers) {
    return <CustomerPageSkeleton />;
  }

  return <CustomerListClient initialCustomers={customers} />;
}