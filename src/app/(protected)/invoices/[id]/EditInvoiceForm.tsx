'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import BillToShipTo from '@/components/invoice/BillToShipTo';

const ItemSchema = z.object({
  description: z.string().nonempty(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  tax_rate: z.number().nonnegative(),
});

const AddressSchema = z.object({
  id: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  is_default_billing: z.boolean().optional(),
  is_default_shipping: z.boolean().optional(),
  created_at: z.string().optional(),
});

const schema = z.object({
  customer_id: z.string(),
  number: z.string().optional(),
  issue_date: z.string(),
  due_date: z.string(),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(ItemSchema).min(1),
  billing_address_id: z.string().optional().nullable(),
  shipping_address_id: z.string().optional().nullable(),
  billing_address: AddressSchema.nullable().optional(),
  shipping_address: AddressSchema.nullable().optional(),
});

interface Props {
  invoice: any;
}

export default function EditInvoiceForm({ invoice }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState(() => ({
    customer_id: invoice.customer_id || '',
    number: invoice.number || '',
    issue_date: invoice.issue_date?.substr(0, 10) || '',
    due_date: invoice.due_date?.substr(0, 10) || '',
    payment_terms: invoice.payment_terms || '',
    notes: invoice.notes || '',
    billing_address_id: invoice.billing_address_id || null,
    shipping_address_id: invoice.shipping_address_id || null,
    billing_address: invoice.billing_address || null,
    shipping_address: invoice.shipping_address || null,
  }));
  const [items, setItems] = useState(invoice.invoice_items || []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data.customers || []);
  };

  const subtotal = items.reduce((sum: number, it: any) => sum + it.quantity * it.unit_price, 0);
  const taxTotal = items.reduce(
    (sum: number, it: any) => sum + (it.quantity * it.unit_price * it.tax_rate) / 100,
    0
  );
  const grandTotal = subtotal + taxTotal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev: any[]) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: field === 'description' ? value : Number(value) } : it))
    );
  };
  const addItem = () =>
    setItems((prev: any[]) => [
      ...prev,
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);
  const removeItem = (idx: number) => setItems((prev: any[]) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, items });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...parsed.data,
        subtotal,
        tax: taxTotal,
        total: grandTotal,
        items,
        billing_address_id: form.billing_address_id,
        shipping_address_id: form.shipping_address_id,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
      return;
    }
    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Invoice</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Same fields as in create form minus status buttons */}
        <div>
          <label className="block text-sm mb-1">Customer ID</label>
          <input
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <BillToShipTo
          customers={customers}
          customerId={form.customer_id}
          form={form}
          setForm={setForm}
          fetchCustomers={fetchCustomers}
        />

        <BillToShipTo
          customers={customers}
          customerId={form.customer_id}
          form={form}
          setForm={setForm}
          fetchCustomers={fetchCustomers}
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Issue Date</label>
            <input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
        {/* items list similar to create */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium">Items</h2>
            <button type="button" onClick={addItem} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
              + Add Item
            </button>
          </div>
          {items.map((it: any, idx: number) => (
            <div key={idx} className="mb-2 grid grid-cols-6 gap-2">
              <input
                className="col-span-2 rounded border px-2 py-1"
                value={it.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
              />
              <input
                type="number"
                className="rounded border px-2 py-1"
                value={it.quantity}
                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
              />
              <input
                type="number"
                className="rounded border px-2 py-1"
                value={it.unit_price}
                onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
              />
              <input
                type="number"
                className="rounded border px-2 py-1"
                value={it.tax_rate}
                onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
              />
              <button type="button" onClick={() => removeItem(idx)} className="rounded bg-red-500 px-2 py-1 text-white">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Payment Terms</label>
            <input name="payment_terms" value={form.payment_terms} onChange={handleChange} className="w-full rounded border px-3 py-2" />
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
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Updating…' : 'Update Invoice'}
        </button>
      </form>
    </div>
  );
}