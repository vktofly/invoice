'use client';
import { useEffect, useState } from 'react';
import Skeleton from './Skeleton';
import { TopExpensesCardSkeleton } from './skeletons/TopExpensesCardSkeleton';

async function fakeDelay() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 4500));
}

export default function TopExpensesCard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeDelay().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <TopExpensesCardSkeleton />;
  }

  const fiscalYears = ['This Fiscal Year', 'Last Fiscal Year', 'Custom'];

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Expenses</h3>
        <select
          className="text-sm bg-transparent border-0 focus:ring-0 focus:outline-none text-muted-foreground"
          defaultValue="This Fiscal Year"
          aria-label="Select Fiscal Year"
        >
          {fiscalYears.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {/* Placeholder for actual expense data */}
        <div className="flex justify-between items-center">
          <p>Office Supplies</p>
          <p>$2,500</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Software Subscriptions</p>
          <p>$1,200</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Travel</p>
          <p>$800</p>
        </div>
      </div>
    </div>
  );
}
