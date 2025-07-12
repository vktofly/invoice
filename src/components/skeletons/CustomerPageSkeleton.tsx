import React from 'react';

const CustomerPageSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-6 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-9 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="h-11 bg-gray-200 rounded-md w-40"></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-gray-50 grid grid-cols-5 gap-4 px-4 py-2">
                <div className="h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 px-4 py-5">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
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
