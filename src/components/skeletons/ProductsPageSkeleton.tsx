import React from 'react';

const ProductsPageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 grid grid-cols-5 gap-6 px-6 py-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded text-right"></div>
            <div className="h-4 bg-gray-200 rounded text-right"></div>
            <div className="h-4 bg-gray-200 rounded text-right"></div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-6 px-6 py-4">
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
  );
};

export default ProductsPageSkeleton;
