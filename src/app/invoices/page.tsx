"use client";
import { useEffect, useState } from "react";
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

interface Invoice {
  id: string;
  number: string;
  customer_id: string;
  issue_date: string;
  status: string;
  total: number;
}

interface Customer {
  id: string;
  name?: string;
  email: string;
}

export default function InvoicesPage() {
  const { currentOrg } = useOrganizationContext();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.user_metadata?.role === 'customer') {
      setError("You do not have access to this page.");
      setLoading(false);
      return;
    }
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [invRes, custRes] = await Promise.all([
          fetch(`/api/invoices${statusFilter ? `?status=${statusFilter}` : ""}`),
          fetch("/api/customers"),
        ]);
        const invData = await invRes.json();
        const custData = await custRes.json();
        if (invRes.ok && custRes.ok) {
          setInvoices(invData || []);
          setCustomers(custData.customers || []);
        } else {
          setError(invData.error || custData.error || "Failed to fetch data.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, statusFilter]);

  const filteredInvoices = invoices.filter(inv => {
    if (!search) return true;
    const customer = customers.find(c => c.id === inv.customer_id);
    return (
      inv.number?.toLowerCase().includes(search.toLowerCase()) ||
      customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">All Invoices</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
            <input
              type="text"
              placeholder="Search by invoice #, customer name, or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-64"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-40"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold">Invoice #</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Download</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => {
                  const customer = customers.find(c => c.id === inv.customer_id);
                  return (
                    <tr key={inv.id} className="border-t">
                      <td className="px-4 py-2">{inv.number}</td>
                      <td className="px-4 py-2">{customer?.name || customer?.email || inv.customer_id}</td>
                      <td className="px-4 py-2">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2 capitalize">{inv.status}</td>
                      <td className="px-4 py-2">₹{inv.total?.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => router.push(`/invoices/${inv.id}/download`)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 