'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import CustomerPageSkeleton from "@/components/skeletons/CustomerPageSkeleton";

interface Customer {
  id: string;
  name?: string;
  email: string;
  customer_type?: string;
  company_name?: string;
  display_name?: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const hasCustomers = customers && customers.length > 0;

  const handleView = (id: string) => {
    window.location.href = `/customer/${id}`;
  };
  const handleEdit = (id: string) => {
    window.location.href = `/customer/${id}/edit`;
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev ? prev.filter((c) => c.id !== id) : prev);
      } else {
        alert('Failed to delete customer');
      }
    } catch {
      alert('Failed to delete customer');
    }
  };

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

      {loading ? (
        <CustomerPageSkeleton />
      ) : hasCustomers ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-white/20 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/20 hover:bg-white/50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-100">{c.display_name || c.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.customer_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{c.company_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleView(c.id)} className="text-blue-500 hover:underline dark:text-blue-400">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleEdit(c.id)} className="text-yellow-500 hover:underline dark:text-yellow-400">
                        <PencilIcon className="h-5 w-5" />
                      </button>
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">No Customers Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Get started by adding your first customer.</p>
          <Link href="/customer/new">
            <button className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2 mx-auto">
              <PlusIcon className="h-5 w-5" />
              Create Customer
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomersPage; 