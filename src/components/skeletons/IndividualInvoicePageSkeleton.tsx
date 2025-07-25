// src/components/skeletons/IndividualInvoicePageSkeleton.tsx
import React from 'react';
import Skeleton from '../Skeleton';

const IndividualInvoicePageSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="p-8 bg-card rounded-lg border shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start pb-8 mb-8 border-b border-border">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="text-right">
            <Skeleton className="h-12 w-40 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Dates */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mt-8">
          <div className="w-full min-w-[600px]">
            <div className="bg-muted/50 grid grid-cols-5 gap-4 p-3">
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
            <div className="border-b border-border">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-border">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8">
          <Skeleton className="h-6 w-16 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default IndividualInvoicePageSkeleton;
