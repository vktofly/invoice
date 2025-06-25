'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const ItemSchema = z.object({
  description: z.string().nonempty('Description required'),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  tax_rate: z.number().nonnegative(),
});

const schema = z.object({
  customer_id: z.string().nonempty('Customer is required'),
  number: z.string().optional(),
  issue_date: z.string().min(1, 'Issue date required'),
  due_date: z.string().min(1, 'Due date required'),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(ItemSchema).min(1, 'At least one item'),
});

type FormData = z.infer<typeof schema>;

export default function NewInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<FormData, 'items'>>({
    customer_id: '',
    number: '',
    issue_date: new Date().toISOString().substr(0, 10),
    due_date: '',
    payment_terms: '',
    notes: '',
  } as any);
  const [items, setItems] = useState<z.infer<typeof ItemSchema>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to compute totals
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  const taxTotal = items.reduce((sum, it) => sum + (it.quantity * it.unit_price * it.tax_rate) / 100, 0);
  const grandTotal = subtotal + taxTotal;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);
  };

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, [field]: field === 'description' ? value : Number(value) } : it
      )
    );
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'sent' = 'draft') => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, items });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...parsed.data,
        status,
        subtotal,
        tax: taxTotal,
        total: grandTotal,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
      return;
    }
    const invoice = await res.json();
    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">New Invoice</h1>
      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Customer ID</label>
          <input
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Issue Date</label>
            <input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            >
              + Add Item
            </button>
          </div>
          {items.length === 0 && <p className="text-sm text-gray-500">No items yet.</p>}
          {items.map((item, idx) => (
            <div key={idx} className="mb-2 grid grid-cols-6 gap-2">
              <input
                placeholder="Description"
                className="col-span-2 rounded border px-2 py-1"
                value={item.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
              />
              <input
                type="number"
                placeholder="Qty"
                className="rounded border px-2 py-1"
                value={item.quantity}
                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                min={1}
              />
              <input
                type="number"
                placeholder="Unit Price"
                step="0.01"
                className="rounded border px-2 py-1"
                value={item.unit_price}
                onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                min={0}
              />
              <input
                type="number"
                placeholder="Tax %"
                step="0.01"
                className="rounded border px-2 py-1"
                value={item.tax_rate}
                onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
                min={0}
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Payment Terms</label>
            <input
              name="payment_terms"
              value={form.payment_terms}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="w-40 space-y-1 text-sm">
            <p>
              <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> ${taxTotal.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ${grandTotal.toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent, 'sent');
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Save & Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 