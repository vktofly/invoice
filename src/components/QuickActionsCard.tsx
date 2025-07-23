'use client';
import { PlusCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { QuickActionsCardSkeleton } from './skeletons/QuickActionsCardSkeleton';

async function fakeDelay() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 1500));
}

export function QuickActionsCard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeDelay().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <QuickActionsCardSkeleton />;
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Invoice
        </button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4">
          <UserGroupIcon className="h-5 w-5 mr-2" />
          New Customer
        </button>
      </div>
    </div>
  );
}