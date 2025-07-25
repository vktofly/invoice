import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import Link from 'next/link';
import InvoiceListClient from './InvoiceListClient';

interface Invoice {
  id: string;
  number: string;
  customer_id: string;
  issue_date: string;
  status: string;
  total: number;
  subtotal: number;
  total_tax: number;
  customer: {
    id: string;
    name?: string;
    email: string;
  };
  [key: string]: any;
}

const getCustomerDisplayName = (customer: any) =>
  customer?.name ||
  [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') ||
  customer?.company_name ||
  customer?.email ||
  customer?.id;

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

async function getInvoices(supabase: any, statusFilter: string) {
  let query = supabase
    .from('invoices')
    .select('*, customer:customers(id, name, email, first_name, last_name, company_name), is_recurring')
    .order('issue_date', { ascending: false });
  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }
  const { data, error } = await query;
  if (error) {
    return [];
  }
  return data;
}

export default async function InvoicesPage({ searchParams }: { searchParams?: { status?: string; search?: string } }) {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor", "customer"];
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
  const statusFilter = searchParams?.status || '';
  const invoices = await getInvoices(supabase, statusFilter);

  return (
    <InvoiceListClient initialInvoices={invoices} userRole={userRole} />
  );
} 