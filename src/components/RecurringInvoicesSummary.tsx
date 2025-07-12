"use client";
import React, { useState, useEffect } from 'react';
import { getRecurringInvoicesSummary } from '@/lib/supabase/recurring_invoices';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const RecurringInvoicesSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getRecurringInvoicesSummary();
      setSummary(data);
      setLoading(false);
    };
    fetchSummary();
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <ArrowPathIcon className="h-6 w-6 inline-block mr-2" />
        Recurring Invoices
      </h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">Active Profiles:</span>
            <span className="text-gray-600 dark:text-gray-300">{summary?.active_count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">Next Due Date:</span>
            <span className="text-gray-600 dark:text-gray-300">{summary?.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
};


