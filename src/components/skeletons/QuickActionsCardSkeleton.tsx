"use client";
import React from 'react';
import Skeleton from '@/components/Skeleton';

export const QuickActionsCardSkeleton = () => (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);
