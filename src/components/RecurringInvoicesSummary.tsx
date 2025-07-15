'use client';

import { useEffect, useState } from 'react';
import { getRecurringInvoicesSummary } from '@/lib/supabase/recurring_invoices';
import { RecurringInvoicesSummary } from '@/lib/types';
import { StatCard } from '@/components/StatCard';
import { ClockIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function RecurringInvoicesSummaryWidget() {
  const [summary, setSummary] = useState<RecurringInvoicesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getRecurringInvoicesSummary();
      setSummary(data);
      setLoading(false);
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Active Recurring Invoices" value={summary?.active_count || 0} icon={ClockIcon} />
      <StatCard title="Projected Monthly Revenue" value={`${(summary?.projected_monthly_revenue || 0).toFixed(2)}`} icon={CalendarIcon} />
      <StatCard title="Projected Yearly Revenue" value={`${(summary?.projected_yearly_revenue || 0).toFixed(2)}`} icon={SparklesIcon} />
    </div>
  );
}