'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';
import SortableTableHeader from '@/components/shared/SortableTableHeader';

type SortDirection = 'ascending' | 'descending';

interface Invoice {
  id: string;
  number: string;
  customer_id: string;
  issue_date: string;
  status: string;
  total: number;
  is_recurring: boolean;
  customer: {
    id: string;
    name?: string;
    email: string;
  };
}

interface InvoiceListClientProps {
  initialInvoices: Invoice[];
  userRole: string;
}

const getCustomerDisplayName = (customer: any) =>
  customer?.name ||
  [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') ||
  customer?.company_name ||
  customer?.email ||
  customer?.id;

export default function InvoiceListClient({ initialInvoices, userRole }: InvoiceListClientProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [recurringFilter, setRecurringFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: 'issue_date',
    direction: 'descending',
  });
  const router = useRouter();

  const sortedAndFilteredInvoices = useMemo(() => {
    let filtered = invoices.filter(inv => {
      const searchLower = search.toLowerCase();
      const statusMatch = !statusFilter || inv.status === statusFilter;
      const recurringMatch = !recurringFilter || (recurringFilter === 'yes' && inv.is_recurring) || (recurringFilter === 'no' && !inv.is_recurring);
      const searchMatch = !search ||
        inv.number?.toLowerCase().includes(searchLower) ||
        getCustomerDisplayName(inv.customer)?.toLowerCase().includes(searchLower);
      
      return statusMatch && recurringMatch && searchMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'customer') {
          aValue = getCustomerDisplayName(a.customer);
          bValue = getCustomerDisplayName(b.customer);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [invoices, search, statusFilter, recurringFilter, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
        console.error(err.message);
      }
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">All Invoices</h1>
        {userRole !== 'customer' && (
          <button
            onClick={() => router.push('/invoices/new')}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Invoice
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-white/20 dark:bg-gray-900/20 rounded-lg">
        <input
          type="text"
          placeholder="Search by # or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input w-full"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input w-full md:col-span-1"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={recurringFilter}
          onChange={e => setRecurringFilter(e.target.value)}
          className="input w-full md:col-span-1"
        >
          <option value="">All Types</option>
          <option value="yes">Recurring</option>
          <option value="no">One-Time</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/50 shadow-inner">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80">
              <SortableTableHeader title="Invoice #" sortKey="number" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="Customer" sortKey="customer" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="Date" sortKey="issue_date" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="Status" sortKey="status" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="Total" sortKey="total" sortConfig={sortConfig} onSort={handleSort} className="text-right" />
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredInvoices.map(inv => (
                <tr 
                  key={inv.id} 
                  className="border-b border-gray-200/80 hover:bg-white/50 dark:border-gray-700/80 dark:hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{inv.number}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                    <Link
                      href={`/customer/${inv.customer.id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {getCustomerDisplayName(inv.customer)}
                    </Link>
                  </td>
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
                      
                      {userRole !== 'customer' && (
                        <>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${inv.id}/edit`); }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}
                            className="btn-danger btn-sm p-2"
                          >
                            <TrashIcon className="h-4 w-4" />
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
    </div>
  );
}