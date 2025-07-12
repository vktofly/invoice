import React from 'react';

/**
 * A reusable skeleton loader component with a pulsing animation.
 * @param className - Additional classes to apply for custom width, height, etc.
 */
const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      data-testid="skeleton"
    />
  );
};

export default Skeleton;