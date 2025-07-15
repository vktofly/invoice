// src/components/skeletons/IndividualInvoicePageSkeleton.tsx
import React from 'react';

const IndividualInvoicePageSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
        <div className="h-10 w-48 bg-gray-300 rounded-md"></div>
      </div>

      <div className="p-8 bg-white/60 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start pb-8 mb-8 border-b">
          <div>
            <div className="h-8 w-48 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-6 w-64 bg-gray-300 rounded-md"></div>
          </div>
          <div className="text-right">
            <div className="h-12 w-40 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          </div>
          <div className="text-right">
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          </div>
          <div className="text-right">
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mt-8">
          <div className="w-full min-w-[600px]">
            <div className="bg-gray-200 grid grid-cols-5 gap-4 p-3">
              <div className="h-6 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded-md"></div>
              <div className="h-6 bg-gray-300 rounded-md"></div>
            </div>
            <div className="border-b">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3">
                  <div className="h-6 bg-gray-300 rounded-md"></div>
                  <div className="h-6 bg-gray-300 rounded-md"></div>
                  <div className="h-6 bg-gray-300 rounded-md"></div>
                  <div className="h-6 bg-gray-300 rounded-md"></div>
                  <div className="h-6 bg-gray-300 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-6 w-16 bg-gray-300 rounded-md"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
              <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8">
          <div className="h-6 w-16 bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-full bg-gray-300 rounded-md"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded-md mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default IndividualInvoicePageSkeleton;
