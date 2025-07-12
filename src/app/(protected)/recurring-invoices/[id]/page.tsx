
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RecurringInvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      const res = await fetch(`/api/recurring-invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      } else {
        router.push('/recurring-invoices');
      }
      setLoading(false);
    };
    fetchInvoice();
  }, [id, router]);

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    await fetch(`/api/recurring-invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/recurring-invoices/${id}`, { method: 'DELETE' });
    router.push('/recurring-invoices');
  };

  if (loading) return <p>Loading...</p>;
  if (!invoice) return <p>Not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Recurring Invoice Details</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p><strong>Customer:</strong> {invoice.customers.name}</p>
        <p><strong>Frequency:</strong> {invoice.frequency}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Next Generation:</strong> {new Date(invoice.next_generation_date).toLocaleDateString()}</p>
      </div>
      <div className="mt-6 flex gap-4">
        {invoice.status === 'active' && <button onClick={() => handleUpdateStatus('paused')} className="btn-secondary">Pause</button>}
        {invoice.status === 'paused' && <button onClick={() => handleUpdateStatus('active')} className="btn-secondary">Resume</button>}
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
