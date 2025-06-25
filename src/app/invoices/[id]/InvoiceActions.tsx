'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  status: string;
}

export default function InvoiceActions({ id, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
      return;
    }
    router.refresh(); // reload server component data
  };

  return (
    <div className="mt-6 space-x-3">
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {status === 'draft' && (
        <button
          onClick={() => updateStatus('sent')}
          disabled={loading === 'sent'}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading === 'sent' ? 'Sending…' : 'Send'}
        </button>
      )}
      {status !== 'paid' && (
        <button
          onClick={() => updateStatus('paid')}
          disabled={loading === 'paid'}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading === 'paid' ? 'Marking…' : 'Mark as Paid'}
        </button>
      )}
      <a
        href={`/invoices/${id}/edit`}
        className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        Edit
      </a>
    </div>
  );
} 