'use client';

import { useState } from 'react';
import ExpenseForm from './ExpenseForm';

interface Expense {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  category?: string;
}

interface ExpenseListClientProps {
  initialExpenses: Expense[];
}

export default function ExpenseListClient({ initialExpenses }: ExpenseListClientProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses.');
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense.');
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Expenses</h1>
      <ExpenseForm onExpenseAdded={fetchExpenses} />
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Expenses</h2>
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
      </div>
    </div>
  );
}