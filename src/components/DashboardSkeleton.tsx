import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const SkeletonInvoiceList = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <ul className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
                <li key={i} className="py-3 flex justify-between items-center">
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-2/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </li>
            ))}
        </ul>
    </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SkeletonInvoiceList />
          </div>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
            <SkeletonInvoiceList />
          </div>
        </div>
      </div>
    </div>
  );
};

