import React from 'react';
import Skeleton from './Skeleton';

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-background">
      {/* Row 1: DashboardStats Skeleton */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>

      {/* Row 2: Charts Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="bg-card p-6 rounded-lg border shadow-sm lg:col-span-2">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-64" />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-64" />
        </div>
      </div>

      {/* Row 3: RecentInvoices Skeleton */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-5 w-1/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: QuickActions, TopCustomers, TotalReceivables etc. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8" />)}
                </div>
            </div>
        </div>
        <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-24" />
            </div>
        </div>
      </div>

      {/* Row 5: More cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-48" />
            </div>
        </div>
        <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-48" />
            </div>
        </div>
        <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-48" />
            </div>
        </div>
      </div>
    </div>
  );
};

