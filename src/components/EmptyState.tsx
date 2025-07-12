
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * A reusable component for displaying empty states in a visually appealing way.
 */
const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
