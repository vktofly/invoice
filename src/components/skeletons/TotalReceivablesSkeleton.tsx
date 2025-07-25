"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TotalReceivablesSkeleton = () => (
  <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </CardContent>
  </Card>
);
