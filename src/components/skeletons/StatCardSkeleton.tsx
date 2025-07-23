"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StatCardSkeleton = () => (
  <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-6 w-6 rounded-sm" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-3/5 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </CardContent>
  </Card>
);
