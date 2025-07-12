
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const RecurringInvoiceSchema = z.object({
  customer_id: z.string().nonempty('Customer is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  start_date: z.string(),
  end_date: z.string().optional(),
  invoice_template: z.object({
    items: z.array(z.object({
      description: z.string().nonempty(),
      quantity: z.number().positive(),
      unit_price: z.number().nonnegative(),
      tax_rate: z.number().min(0).max(100),
    })).min(1),
    notes: z.string().optional(),
  }),
});

type FormState = z.infer<typeof RecurringInvoiceSchema>;

export default function NewRecurringInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [formState, setFormState] = useState<FormState>({
    customer_id: '',
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    invoice_template: {
      items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    };
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formState.invoice_template.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormState(prev => ({ ...prev, invoice_template: { ...prev.invoice_template, items: newItems } }));
  };

  const addItem = () => {
    setFormState(prev => ({
      ...prev,
      invoice_template: {
        ...prev.invoice_template,
        items: [...prev.invoice_template.items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
      },
    }));
  };

  const removeItem = (index: number) => {
    setFormState(prev => ({
      ...prev,
      invoice_template: {
        ...prev.invoice_template,
        items: prev.invoice_template.items.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = RecurringInvoiceSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/recurring-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Failed to create recurring invoice');
      router.push('/recurring-invoices');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Recurring Invoice</h1>
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="customer_id" value={formState.customer_id} onChange={handleInputChange} className="input">
              <option value="">Select a customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select name="frequency" value={formState.frequency} onChange={handleInputChange} className="input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input type="date" name="start_date" value={formState.start_date} onChange={handleInputChange} className="input" />
            <input type="date" name="end_date" value={formState.end_date || ''} onChange={handleInputChange} className="input" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Invoice Template</h2>
          {formState.invoice_template.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="input col-span-5" />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="input col-span-2" />
              <input type="number" placeholder="Price" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} className="input col-span-2" />
              <input type="number" placeholder="Tax %" value={item.tax_rate} onChange={e => handleItemChange(index, 'tax_rate', parseFloat(e.target.value))} className="input col-span-2" />
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">X</button>
            </div>
          ))}
          <button onClick={addItem} className="btn-secondary mt-2">Add Item</button>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">Save Recurring Invoice</button>
        </div>
      </div>
    </div>
  );
}
