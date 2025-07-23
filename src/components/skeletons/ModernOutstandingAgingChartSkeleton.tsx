"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const ModernOutstandingAgingChartSkeleton = () => (
  <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <Skeleton className="h-6 w-1/2 mb-4" />
    <div className="w-full h-[300px] flex items-center justify-center">
      <Skeleton className="h-[160px] w-[160px] rounded-full" />
    </div>
  </div>
);
