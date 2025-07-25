import React from 'react';
import Skeleton from '../Skeleton';

const ExpensesPageSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-background">
      <Skeleton className="h-9 w-48 mb-6" />

      {/* Form Skeleton */}
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
        <Skeleton className="h-7 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <Skeleton className="h-7 w-1/3 mb-4" />
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-muted/50 grid grid-cols-5 gap-4 px-4 py-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-5" />
              ))}
            </div>
            <div className="divide-y divide-border">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-4 py-5">
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5 col-span-2" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPageSkeleton;
