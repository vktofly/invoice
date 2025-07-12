
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const ExpenseSchema = z.object({
  vendor_name: z.string().nonempty('Vendor name is required'),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  expense_date: z.string(),
  category: z.string().optional(),
  receipt_url: z.string().url().optional(),
});

type FormState = z.infer<typeof ExpenseSchema>;

export default function NewExpensePage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    vendor_name: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = ExpenseSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Failed to create expense');
      router.push('/expenses');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Expense</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <input type="text" name="vendor_name" placeholder="Vendor" onChange={handleInputChange} className="input w-full" />
        <textarea name="description" placeholder="Description" onChange={handleInputChange} className="input w-full"></textarea>
        <input type="number" name="amount" placeholder="Amount" onChange={handleInputChange} className="input w-full" />
        <input type="date" name="expense_date" value={formState.expense_date} onChange={handleInputChange} className="input w-full" />
        <input type="text" name="category" placeholder="Category" onChange={handleInputChange} className="input w-full" />
        <input type="text" name="receipt_url" placeholder="Receipt URL" onChange={handleInputChange} className="input w-full" />
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">Save Expense</button>
        </div>
      </div>
    </div>
  );
}
