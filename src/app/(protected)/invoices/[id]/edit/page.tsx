import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { notFound } from 'next/navigation';
import { User, Customer, Organization, Invoice } from '@/lib/types';

async function getInvoice(id: string, supabase: any) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, items:invoice_items(*), customer:customers(*)')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
  return data;
}

async function getCustomers(supabase: any) {
  const { data, error } = await supabase.from('customers').select('*');
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
      return null;
    }
    const { data: org, error: orgDetailsError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgData.organization_id)
      .single();
    if (orgDetailsError) {
      return null;
    }
    return org;
}

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const supabase = getServerSupabase();
  const user = await getUser();
  const userRole = await getUserRole();

  if (!user || userRole === 'customer') {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">Not Authorized</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
  }

  const [invoice, customers, organization] = await Promise.all([
    getInvoice(params.id, supabase),
    getCustomers(supabase),
    getOrganization(supabase, user.id)
  ]);

  if (!invoice) {
    notFound();
  }

  return <InvoiceForm initialInvoice={invoice as Invoice} user={user as User} customers={customers as Customer[]} organization={organization as Organization} />;
}
