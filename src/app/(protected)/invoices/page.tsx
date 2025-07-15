'use client'
import { useEffect, useState } from "react";
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import RoleProtected from '@/components/RoleProtected';

import InvoicePageSkeleton from '@/components/skeletons/InvoicePageSkeleton';
import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string;
  customer_id: string;
  issue_date: string;
  status: string;
  total: number;
  subtotal: number;
  total_tax: number;
  customers: {
    id: string;
    name?: string;
    email: string;
  };
  // Add all other invoice fields needed for the PDF
  [key: string]: any;
}

export default function InvoicesPage() {
  const { currentOrg } = useOrganizationContext();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ensure user is loaded before fetching
    if (!user?.id) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // The API route is already protected, so we just fetch
        const res = await fetch(`/api/invoices?status=${statusFilter}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch invoices.');
        }
        const data = await res.json();
        setInvoices(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id, statusFilter]); // Depend on user.id to re-trigger when user loads
  const filteredInvoices = invoices.filter(inv => {
    if (!search) return true;
    return (
      inv.number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customers?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to delete invoice.');
        }
        setInvoices(invoices.filter(inv => inv.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <RoleProtected allowedRoles={["user", "vendor", "customer"]}>
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">All Invoices</h1>
          {user?.user_metadata?.role !== 'customer' && (
            <button
              onClick={() => router.push('/invoices/new')}
              className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Invoice
            </button>
          )}
        </div>
        {loading ? (
          <InvoicePageSkeleton />
        ) : error ? (
          <div className="text-red-500 bg-red-100 border border-red-400 rounded-md p-4 mb-4 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">{error}</div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
              <input
                type="text"
                placeholder="Search by invoice #, customer name, or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-64 rounded-md border-white/30 bg-white/50 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full md:w-40 rounded-md border-white/30 bg-white/50 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Invoice #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                      <tr 
                        key={inv.id} 
                        className="border-b border-white/20 hover:bg-white/50 dark:border-gray-700 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => router.push(`/invoices/${inv.id}`)}
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{inv.number}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{inv.customers?.name || inv.customers?.email || inv.customer_id}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : ''}</td>
                        <td className="px-4 py-3 capitalize">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            inv.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            inv.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            inv.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-600/50 dark:text-gray-300'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-100">₹{inv.total?.toLocaleString()}</td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-500 hover:underline dark:text-blue-400"
                              onClick={() => router.push(`/invoices/${inv.id}`)}
                            >
                              View
                            </button>
                            {user?.user_metadata?.role !== 'customer' && (
                              <>
                                <button
                                  className="text-blue-500 hover:underline dark:text-blue-400"
                                  onClick={() => router.push(`/invoices/${inv.id}/edit`)}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(inv.id)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <InvoicePDFDownloader invoiceId={inv.id} />
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </RoleProtected>
  );
} 