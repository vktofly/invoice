
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const TimeEntrySchema = z.object({
  task_description: z.string().nonempty('Task description is required'),
  start_time: z.string().datetime('Invalid start time'),
  end_time: z.string().datetime('Invalid end time').optional(),
  is_billable: z.boolean().default(true),
});

type FormState = z.infer<typeof TimeEntrySchema>;

export default function NewTimeEntryPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    task_description: '',
    start_time: new Date().toISOString().slice(0, 16),
    is_billable: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        value = target.checked;
    } else {
        value = target.value;
    }

    setFormState(prev => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = TimeEntrySchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Failed to create time entry');
      router.push('/time-tracking');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Time Entry</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <input type="text" name="task_description" placeholder="Task Description" onChange={handleInputChange} className="input w-full" />
        <label className="block text-sm font-medium text-gray-700">Start Time</label>
        <input type="datetime-local" name="start_time" value={formState.start_time} onChange={handleInputChange} className="input w-full" />
        <label className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
        <input type="datetime-local" name="end_time" value={formState.end_time || ''} onChange={handleInputChange} className="input w-full" />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_billable" checked={formState.is_billable} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label className="text-sm font-medium text-gray-700">Billable</label>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">Save Time Entry</button>
        </div>
      </div>
    </div>
  );
}
