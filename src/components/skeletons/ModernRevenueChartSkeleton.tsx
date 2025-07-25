"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const ModernRevenueChartSkeleton = () => (
  <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <Skeleton className="h-6 w-1/4 mb-4" />
    <div className="w-full h-[300px]">
      <Skeleton className="w-full h-full" />
    </div>
  </div>
);