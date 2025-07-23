'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SortableTableHeader from '@/components/shared/SortableTableHeader';

type SortDirection = 'ascending' | 'descending';

interface Customer {
  id: string;
  name?: string;
  email: string;
  customer_type?: string;
  company_name?: string;
  display_name?: string;
}

interface CustomerListClientProps {
  initialCustomers: Customer[];
}

export default function CustomerListClient({ initialCustomers }: CustomerListClientProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: 'display_name',
    direction: 'ascending',
  });

  const sortedAndFilteredCustomers = useMemo(() => {
    let filtered = customers.filter(c => {
      const searchLower = search.toLowerCase();
      const typeMatch = !typeFilter || c.customer_type === typeFilter;
      const searchMatch = !search ||
        c.display_name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.company_name?.toLowerCase().includes(searchLower);
      
      return typeMatch && searchMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

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
  }, [customers, search, typeFilter, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete customer');
      }
    } catch {
      alert('Failed to delete customer');
    }
  };

  const hasCustomers = sortedAndFilteredCustomers.length > 0;

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage your contacts, all in one place.</p>
        </div>
        <Link href="/customer/new">
          <button className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New Customer
          </button>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
        <input
          type="text"
          placeholder="Search by name, email, or company"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input w-full md:w-64"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="form-input w-full md:w-40"
        >
          <option value="">All Types</option>
          <option value="Business">Business</option>
          <option value="Individual">Individual</option>
        </select>
      </div>

      {hasCustomers ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-white/20 dark:border-gray-700">
                <SortableTableHeader title="Name" sortKey="display_name" sortConfig={sortConfig} onSort={handleSort} />
                <SortableTableHeader title="Email" sortKey="email" sortConfig={sortConfig} onSort={handleSort} />
                <SortableTableHeader title="Type" sortKey="customer_type" sortConfig={sortConfig} onSort={handleSort} />
                <SortableTableHeader title="Company" sortKey="company_name" sortConfig={sortConfig} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredCustomers.map((c) => (
                <tr key={c.id} className="border-b border-white/20 hover:bg-white/50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-100">{c.display_name || c.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.customer_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.company_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <Link href={`/customer/${c.id}`} className="text-blue-500 hover:underline dark:text-blue-400">
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link href={`/customer/${c.id}/edit`} className="text-yellow-500 hover:underline dark:text-yellow-400">
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline dark:text-red-400">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border-dashed border-2 border-white/20 rounded-lg dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">No Customers Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Your search or filter criteria did not match any customers.</p>
        </div>
      )}
    </div>
  );
}