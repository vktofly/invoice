import { useEffect, useState } from 'react';

/**
 * TotalReceivables component
 * Displays the total receivables, progress bar, and breakdown by days.
 * Replace placeholder data with real data from Supabase.
 */
export default function TotalReceivables() {
  // Placeholder data; replace with real fetch
  const [data, setData] = useState({
    total: 0,
    current: 0,
    overdue_1_15: 0,
    overdue_16_30: 0,
    overdue_31_45: 0,
    overdue_45_plus: 0,
  });
  // useEffect(() => { /* Fetch data here */ }, []);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Total Receivables</h2>
        <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
          <span className="text-xl leading-none">+</span> New
        </button>
      </div>
      <div className="mb-2 text-2xl font-bold">₹{data.total.toFixed(2)}</div>
      {/* Progress bar (static for now) */}
      <div className="w-full h-2 bg-gray-100 rounded mb-4">
        <div className="h-2 bg-indigo-400 rounded" style={{ width: '10%' }} />
      </div>
      {/* Breakdown by days */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-blue-600 font-medium">CURRENT</span>
          <div className="font-semibold">₹{data.current.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-red-500 font-medium">OVERDUE</span>
          <div className="font-semibold">₹{data.overdue_1_15.toFixed(2)}</div>
          <div className="text-xs text-gray-400">1-15 Days</div>
        </div>
        <div>
          <span className="text-red-400 font-medium"> </span>
          <div className="font-semibold">₹{data.overdue_16_30.toFixed(2)}</div>
          <div className="text-xs text-gray-400">16-30 Days</div>
        </div>
        <div>
          <span className="text-red-300 font-medium"> </span>
          <div className="font-semibold">₹{data.overdue_31_45.toFixed(2)}</div>
          <div className="text-xs text-gray-400">31-45 Days</div>
        </div>
        <div>
          <span className="text-red-200 font-medium"> </span>
          <div className="font-semibold">₹{data.overdue_45_plus.toFixed(2)}</div>
          <div className="text-xs text-gray-400">Above 45 days</div>
        </div>
      </div>
    </section>
  );
} 