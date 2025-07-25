import React from 'react';

import Skeleton from '../Skeleton';

const InvoicePageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
        <Skeleton className="h-10 w-full md:w-64" />
        <Skeleton className="h-10 w-full md:w-40" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full border rounded-lg bg-card">
          <div className="bg-muted/50">
            <div className="flex">
              <div className="px-4 py-3 w-1/4"><Skeleton className="h-4" /></div>
              <div className="px-4 py-3 w-1/4"><Skeleton className="h-4" /></div>
              <div className="px-4 py-3 w-1/4"><Skeleton className="h-4" /></div>
              <div className="px-4 py-3 w-1/4"><Skeleton className="h-4" /></div>
              <div className="px-4 py-3 w-1/6"><Skeleton className="h-4" /></div>
              <div className="px-4 py-3 w-1/6"><Skeleton className="h-4" /></div>
            </div>
          </div>
          <div className='divide-y divide-border'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex">
                <div className="px-4 py-4 w-1/4"><Skeleton className="h-4" /></div>
                <div className="px-4 py-4 w-1/4"><Skeleton className="h-4" /></div>
                <div className="px-4 py-4 w-1/4"><Skeleton className="h-4" /></div>
                <div className="px-4 py-4 w-1/4"><Skeleton className="h-4" /></div>
                <div className="px-4 py-4 w-1/6"><Skeleton className="h-4" /></div>
                <div className="px-4 py-4 w-1/6"><Skeleton className="h-4" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePageSkeleton;
