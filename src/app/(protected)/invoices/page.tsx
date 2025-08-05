import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import InvoiceListClient from './InvoiceListClient';
import { Database } from '@/types/db';

type InvoiceStatus = Database['public']['Enums']['invoice_status'];

export const revalidate = 0;

// Helper function to get the current user's role
async function getUserRole() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }
  return data?.role;
}

// Helper function to get the current user
async function getUser() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Helper function to get the organization for a user
async function getOrganization(userId: string) {
    const supabase = createSupabaseServerClient();
    const { data: orgData, error: orgError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userId)
        .single();
    if (orgError || !orgData?.organization_id) {
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

// Main Page Component
export default async function InvoicesPage({ searchParams }: { searchParams?: { status?: string; search?: string } }) {
  const supabase = createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return <div>Please log in to view invoices.</div>;
  }

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

  const organization = await getOrganization(user.id);
  
  let query = supabase
    .from('invoices')
    .select('*, customer:customers(id, name, email, first_name, last_name, company_name), is_recurring')
    .order('issue_date', { ascending: false });

  // Apply filters based on role
  if (userRole === 'customer') {
    query = query.eq('customer_id', user.id);
  } else if (userRole === 'user' && organization) {
    query = query.eq('organization_id', organization.id);
  }

  // Apply status filter if present
  if (searchParams?.status) {
    query = query.eq('status', searchParams.status as InvoiceStatus);
  }

  const { data: invoices, error } = await query;

  if (error) {
    console.error("Error fetching invoices:", error);
    return <div>Error loading invoices. Please try again.</div>
  }

  return (
    <InvoiceListClient initialInvoices={invoices || []} userRole={userRole} />
  );
}