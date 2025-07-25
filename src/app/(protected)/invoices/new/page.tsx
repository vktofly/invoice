import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import InvoiceForm from '@/components/invoice/InvoiceForm';

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

export default async function NewInvoicePage() {
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
  const user = await getUser();
  
  const [customers, organization] = await Promise.all([
    getCustomers(supabase),
    getOrganization(supabase, user.id)
  ]);

  return <InvoiceForm initialInvoice={null} user={user} customers={customers} organization={organization} />;
}