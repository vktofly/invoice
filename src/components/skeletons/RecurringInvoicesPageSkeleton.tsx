import React from 'react';

import Skeleton from '../Skeleton';

const RecurringInvoicesPageSkeleton = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
      </div>
      <ul className="divide-y divide-border">
        {[...Array(5)].map((_, i) => (
          <li key={i}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48 mt-2 sm:mt-0 sm:ml-6" />
                </div>
                <div className="mt-2 sm:mt-0">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecurringInvoicesPageSkeleton;
