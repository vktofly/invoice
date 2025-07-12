import React from 'react';

const InvoicePageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-end animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full md:w-64"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-40"></div>
      </div>
      <div className="overflow-x-auto animate-pulse">
        <div className="min-w-full border rounded bg-white">
          <div className="bg-gray-50">
            <div className="flex">
              <div className="px-4 py-3 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
              <div className="px-4 py-3 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
              <div className="px-4 py-3 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
              <div className="px-4 py-3 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
              <div className="px-4 py-3 w-1/6"><div className="h-4 bg-gray-200 rounded"></div></div>
              <div className="px-4 py-3 w-1/6"><div className="h-4 bg-gray-200 rounded"></div></div>
            </div>
          </div>
          <div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex border-t">
                <div className="px-4 py-4 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
                <div className="px-4 py-4 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
                <div className="px-4 py-4 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
                <div className="px-4 py-4 w-1/4"><div className="h-4 bg-gray-200 rounded"></div></div>
                <div className="px-4 py-4 w-1/6"><div className="h-4 bg-gray-200 rounded"></div></div>
                <div className="px-4 py-4 w-1/6"><div className="h-4 bg-gray-200 rounded"></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePageSkeleton;
