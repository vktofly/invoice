"use client";
import React, { useState, useEffect } from 'react';
import { listTopCustomers } from '@/lib/supabase/customers';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { TopCustomer } from '@/lib/types';

export const TopCustomers = () => {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await listTopCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <UserGroupIcon className="h-6 w-6 inline-block mr-2" />
        Top Customers
      </h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <ul className="divide-y divide-white/20 dark:divide-gray-700">
          {customers.map((customer) => (
            <li key={customer.customer_id} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-800 dark:text-gray-100">{customer.name}</span>
              <span className="text-gray-600 dark:text-gray-300">₹{customer.total_invoiced.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

