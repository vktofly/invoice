import React from 'react';

const RecurringInvoicesPageSkeleton = () => {
  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      </div>
      <ul className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <li key={i}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mt-2 sm:mt-0 sm:ml-6"></div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
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
