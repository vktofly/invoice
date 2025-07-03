import { useState } from 'react';

/**
 * SalesExpensesChart component
 * Displays a chart of sales and expenses with a fiscal year dropdown.
 * Replace the placeholder with a real chart (e.g., Chart.js) and fetch data as needed.
 */
export default function SalesExpensesChart() {
  const [fiscalYear, setFiscalYear] = useState('This Fiscal Year');
  const fiscalYears = ['This Fiscal Year', 'Last Fiscal Year', 'Custom'];

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Sales and Expenses</h2>
        {/* Fiscal year dropdown */}
        <select
          className="rounded border px-2 py-1 text-sm"
          value={fiscalYear}
          onChange={e => setFiscalYear(e.target.value)}
          aria-label="Select Fiscal Year"
        >
          {fiscalYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {/* Placeholder for chart - replace with real chart */}
      <div className="h-48 flex items-center justify-center text-gray-400">[Sales/Expenses Chart]</div>
    </div>
  );
} 