
'use client';

import { useState } from 'react';
import SalesReport from '@/components/reports/SalesReport';
import ExpenseReport from '@/components/reports/ExpenseReport';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Reports</h1>
      <div className="mb-6">
        <select 
          onChange={e => setReportType(e.target.value)} 
          value={reportType} 
          className="input bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600"
        >
          <option value="sales">Sales Report</option>
          <option value="expenses">Expense Report</option>
        </select>
      </div>

      {reportType === 'sales' && <SalesReport />}
      {reportType === 'expenses' && <ExpenseReport />}
    </div>
  );
}
