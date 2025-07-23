'use client';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

type SortDirection = 'ascending' | 'descending';

interface SortableTableHeaderProps {
  title: string;
  sortKey: string;
  sortConfig: { key: string; direction: SortDirection } | null;
  onSort: (key: string) => void;
  className?: string;
}

export default function SortableTableHeader({
  title,
  sortKey,
  sortConfig,
  onSort,
  className = '',
}: SortableTableHeaderProps) {
  const isSorting = sortConfig?.key === sortKey;
  const direction = isSorting ? sortConfig.direction : undefined;

  return (
    <th
      className={`px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-500/10 ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        <span>{title}</span>
        <span className="ml-2">
          {isSorting && direction === 'ascending' && <ChevronUpIcon className="h-4 w-4" />}
          {isSorting && direction === 'descending' && <ChevronDownIcon className="h-4 w-4" />}
        </span>
      </div>
    </th>
  );
}
