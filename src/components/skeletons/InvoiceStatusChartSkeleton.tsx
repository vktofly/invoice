"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const InvoiceStatusChartSkeleton = () => (
  <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <div className="w-full h-[300px] flex items-center justify-center">
      <Skeleton className="h-[220px] w-[220px] rounded-full" />
    </div>
  </div>
);