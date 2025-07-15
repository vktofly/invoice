'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import RecurringInvoiceList from '@/components/recurring-invoices/RecurringInvoiceList';
import RecurringInvoicesPageSkeleton from '@/components/skeletons/RecurringInvoicesPageSkeleton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RoleProtected from '@/components/RoleProtected';

export default function RecurringInvoicesPage() {
  const [recurringInvoices, setRecurringInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecurringInvoices = async () => {
      const { data, error } = await supabase
        .from('recurring_invoices')
        .select('*, customers(name)');
      
      if (error) {
        console.error('Error fetching recurring invoices:', error);
      } else {
        setRecurringInvoices(data);
      }
      setLoading(false);
    };

    fetchRecurringInvoices();
  }, []);

  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recurring Invoices</h1>
          <button
            onClick={() => router.push('/recurring-invoices/new')}
            className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            New Recurring Invoice
          </button>
        </div>
        {loading ? (
          <RecurringInvoicesPageSkeleton />
        ) : (
          <RecurringInvoiceList recurringInvoices={recurringInvoices} />
        )}
      </div>
    </RoleProtected>
  );
}