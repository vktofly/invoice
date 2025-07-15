
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchExpense = async () => {
      const res = await fetch(`/api/expenses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setExpense(data);
      } else {
        router.push('/expenses');
      }
      setLoading(false);
    };
    fetchExpense();
  }, [id, router]);

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    router.push('/expenses');
  };

  if (loading) return <p>Loading...</p>;
  if (!expense) return <p>Not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Expense Details</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p><strong>Vendor:</strong> {expense.vendor_name}</p>
        <p><strong>Description:</strong> {expense.description}</p>
        <p><strong>Amount:</strong> ${(expense.amount || 0).toFixed(2)}</p>
        <p><strong>Date:</strong> {new Date(expense.expense_date).toLocaleDateString()}</p>
        <p><strong>Category:</strong> {expense.category}</p>
        {expense.receipt_url && <p><a href={expense.receipt_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View Receipt</a></p>}
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={() => router.push(`/expenses/${id}/edit`)} className="btn-secondary">Edit</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
