import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export default function Skeleton({ width = "w-full", height = "h-6", rounded = "rounded-md", className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${width} ${height} ${rounded} ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
} 