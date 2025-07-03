import { useState } from 'react';

/**
 * TopExpensesCard component
 * Displays a table of top expenses with a fiscal year dropdown.
 * Replace the placeholder with real expense data from Supabase.
 */
export default function TopExpensesCard() {
  const [fiscalYear, setFiscalYear] = useState('This Fiscal Year');
  const fiscalYears = ['This Fiscal Year', 'Last Fiscal Year', 'Custom'];

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-1 mb-2">
        <h2 className="text-lg font-semibold">Top Expenses</h2>
        {/* Fiscal year dropdown for expenses */}
        <select
          className="ml-auto rounded border px-2 py-1 text-sm"
          value={fiscalYear}
          onChange={e => setFiscalYear(e.target.value)}
          aria-label="Select Fiscal Year"
        >
          {fiscalYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {/* Placeholder for top expenses table */}
      <div className="h-24 flex items-center justify-center text-gray-400">[Top Expenses Table]</div>
    </div>
  );
} 