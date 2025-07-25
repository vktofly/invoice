"use client";
import React from 'react';
import { StatCardSkeleton } from "./StatCardSkeleton";

export const DashboardStatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
  </div>
);