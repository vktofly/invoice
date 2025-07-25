'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const ExpenseSchema = z.object({
  description: z.string().nonempty('Description is required.'),
  amount: z.number({ invalid_type_error: 'Amount is required.' }).positive('Amount must be positive.'),
  expense_date: z.string().nonempty('Date is required.'),
  category: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0],
    }
  });

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
      onExpenseAdded();
      reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}