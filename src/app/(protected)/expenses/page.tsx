'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ExpensesPageSkeleton from '@/components/skeletons/ExpensesPageSkeleton';

const ExpenseSchema = z.object({
  category: z.string().optional(),
  description: z.string().nonempty('Description is required.'),
  amount: z.number({ invalid_type_error: 'Amount is required.' }).positive('Amount must be positive.'),
  expense_date: z.string().nonempty('Date is required.'),
});

type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

interface Expense extends ExpenseFormValues {
  id: string;
  receipt_url?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0],
    }
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses.');
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onSubmit: SubmitHandler<ExpenseFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create expense.');
      }
      await fetchExpenses(); // Refresh the list
      reset(); // Clear the form
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense.');
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Expenses</h1>

      {/* Add Expense Form */}
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 mb-8 dark:bg-gray-800/40 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Expense</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
            <input
              id="description"
              {...register('description')}
              className="input w-full mt-1 bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="input w-full mt-1 bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label htmlFor="expense_date" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
            <input
              id="expense_date"
              type="date"
              {...register('expense_date')}
              className="input w-full mt-1 bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600"
            />
            {errors.expense_date && <p className="text-red-500 text-sm mt-1">{errors.expense_date.message}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Category (Optional)</label>
            <input
              id="category"
              {...register('category')}
              className="input w-full mt-1 bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {/* Expenses Table */}
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Expenses</h2>
        {loading ? (
          <ExpensesPageSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} className="border-b border-white/20 hover:bg-white/50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{new Date(exp.expense_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{exp.description}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{exp.category || '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-100">₹{(exp.amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:underline dark:text-red-400">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && <p className="text-center text-gray-500 py-4 dark:text-gray-400">No expenses recorded yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}