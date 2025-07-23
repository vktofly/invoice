
import React from 'react';
import Skeleton from '../Skeleton';

const LandingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex justify-between items-center max-w-7xl p-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-x-4 flex items-center">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
          <Skeleton className="h-12 w-48 mx-auto rounded-full mb-16" />
          <Skeleton className="h-96 w-full rounded-lg shadow-2xl" />
        </div>
      </main>

      {/* Features Skeleton */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-full mx-auto" />
            <Skeleton className="h-6 w-5/6 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-background p-8 rounded-xl shadow-sm border border-border">
                <Skeleton className="h-8 w-8 mb-5 rounded-full" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Skeleton */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-5/6 mb-8" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageSkeleton;
