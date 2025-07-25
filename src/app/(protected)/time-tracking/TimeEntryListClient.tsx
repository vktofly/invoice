'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface TimeEntry {
  id: string;
  task_description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_billable: boolean;
}

interface TimeEntryListClientProps {
  initialTimeEntries: TimeEntry[];
}

export default function TimeEntryListClient({ initialTimeEntries }: TimeEntryListClientProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <Link href="/time-tracking/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Time Entry
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billable</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeEntries.map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.task_description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.start_time).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.end_time).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{entry.duration_minutes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.is_billable ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/time-tracking/${entry.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}