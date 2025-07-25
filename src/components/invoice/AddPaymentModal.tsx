'use client';

import { useState } from 'react';
import { z } from 'zod';

const PaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  payment_date: z.string().nonempty('Payment date is required'),
  payment_method: z.string().nonempty('Payment method is required'),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof PaymentSchema>;

interface AddPaymentModalProps {
  invoiceId: string;
  balanceDue: number;
  onClose: () => void;
  onPaymentAdded: (newPayment: any) => void;
}

export default function AddPaymentModal({ invoiceId, balanceDue, onClose, onPaymentAdded }: AddPaymentModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: balanceDue,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'Bank Transfer',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = PaymentSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add payment');
      }

      const newPayment = await res.json();
      onPaymentAdded(newPayment);
      onClose();
    } catch (error: any) {
      setErrors({ form: [error.message] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Record Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="input w-full mt-1"
              step="0.01"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleInputChange}
              className="input w-full mt-1"
            />
            {errors.payment_date && <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>}
          </div>
          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="input w-full mt-1"
            >
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>PayPal</option>
              <option>Cash</option>
              <option>Other</option>
            </select>
            {errors.payment_method && <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>}
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input w-full mt-1"
              rows={3}
            />
          </div>
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary bg-indigo-600 hover:bg-indigo-700">
              {loading ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
