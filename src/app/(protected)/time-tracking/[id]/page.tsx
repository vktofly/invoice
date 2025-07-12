
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TimeEntryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [timeEntry, setTimeEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTimeEntry = async () => {
      const res = await fetch(`/api/time-entries/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTimeEntry(data);
      } else {
        router.push('/time-tracking');
      }
      setLoading(false);
    };
    fetchTimeEntry();
  }, [id, router]);

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/time-entries/${id}`, { method: 'DELETE' });
    router.push('/time-tracking');
  };

  if (loading) return <p>Loading...</p>;
  if (!timeEntry) return <p>Not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Time Entry Details</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p><strong>Task:</strong> {timeEntry.task_description}</p>
        <p><strong>Start Time:</strong> {new Date(timeEntry.start_time).toLocaleString()}</p>
        <p><strong>End Time:</strong> {timeEntry.end_time ? new Date(timeEntry.end_time).toLocaleString() : 'N/A'}</p>
        <p><strong>Duration:</strong> {timeEntry.duration_minutes} minutes</p>
        <p><strong>Billable:</strong> {timeEntry.is_billable ? 'Yes' : 'No'}</p>
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={() => router.push(`/time-tracking/${id}/edit`)} className="btn-secondary">Edit</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
