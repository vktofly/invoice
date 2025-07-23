'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { Invoice, User, Customer, Organization } from '@/lib/types';

export default function EditInvoicePage() {
  const params = useParams();
  const { id } = params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, userRes, customersRes, orgRes] = await Promise.all([
          fetch(`/api/invoices/${id}`),
          fetch('/api/profile'),
          fetch('/api/customers'),
          fetch('/api/organization'),
        ]);

        if (!invoiceRes.ok) throw new Error('Failed to fetch invoice data for editing.');
        if (!userRes.ok) throw new Error('Failed to fetch user data.');
        if (!customersRes.ok) throw new Error('Failed to fetch customers data.');
        if (!orgRes.ok) throw new Error('Failed to fetch organization data.');

        const invoiceData = await invoiceRes.json();
        const userData = await userRes.json();
        const customersData = await customersRes.json();
        const orgData = await orgRes.json();

        setInvoice(invoiceData);
        setUser(userData.user);
        setCustomers(customersData.customers);
        setOrganization(orgData.organization);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading invoice data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!invoice) {
    return <div className="flex justify-center items-center h-screen">Could not load invoice to edit.</div>;
  }

  return <InvoiceForm initialInvoice={invoice} user={user} customers={customers} organization={organization} />;
}