"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const TopProductsSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <Skeleton className="h-6 w-1/2 mb-4" />
    <ul className="divide-y divide-border">
      {[...Array(5)].map((_, i) => (
        <li key={i} className="py-3 flex justify-between items-center">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/5" />
        </li>
      ))}
    </ul>
  </div>
);