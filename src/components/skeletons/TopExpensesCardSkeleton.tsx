"use client";
import React from 'react';
import Skeleton from "@/components/Skeleton";

export const TopExpensesCardSkeleton = () => (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
    </div>
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-1/5" />
                </div>
            ))}
        </div>
    </div>
);
