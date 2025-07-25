import React from 'react';

import Skeleton from '../Skeleton';

const ProductsPageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-background">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <div className="min-w-full">
          <div className="bg-muted/50 grid grid-cols-5 gap-6 px-6 py-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
          <div className="divide-y divide-border">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-6 px-6 py-4">
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageSkeleton;
