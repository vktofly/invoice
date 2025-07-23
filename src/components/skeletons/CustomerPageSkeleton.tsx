import React from 'react';
import Skeleton from '../Skeleton';

const CustomerPageSkeleton = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-muted/50 grid grid-cols-5 gap-4 px-4 py-2">
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
              </div>
              <div className="divide-y divide-border">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 px-4 py-5">
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerPageSkeleton;
