import React from 'react';

const ExpensesPageSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="h-9 bg-gray-200 rounded w-48 mb-6"></div>

      {/* Form Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <div className="h-11 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 grid grid-cols-5 gap-4 px-4 py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-4 py-5">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
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
