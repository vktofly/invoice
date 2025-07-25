"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const RecentInvoicesSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <div className="mt-4 w-full">
      {/* Table Header */}
      <div className="flex justify-between text-left text-gray-500 text-sm px-2 py-1">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Table Body */}
      <div className="divide-y divide-border">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center px-2 py-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <div className="flex justify-center space-x-2 w-20">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);