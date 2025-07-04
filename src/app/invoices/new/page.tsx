'use client';

import { useState, useEffect, useRef } from 'react';
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

// --- Invoice Creation Page ---
export default function NewInvoicePage() {
  const router = useRouter();

  // --- State for invoice form fields ---
  // Holds all invoice fields except items
  const [form, setForm] = useState<Omit<FormData, 'items'>>({
    customer_id: '',
    number: '',
    issue_date: new Date().toISOString().substr(0, 10),
    due_date: '',
    payment_terms: '',
    notes: '',
  } as any);
  // Holds the list of invoice line items
  const [items, setItems] = useState<z.infer<typeof ItemSchema>[]>([]);
  // Error and loading state for form submission
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Customer selection and search state ---
  // List of all customers fetched from backend
  const [customers, setCustomers] = useState<{ id: string; email: string; name?: string }[]>([]);

  // --- Miscellaneous UI state ---
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [terms, setTerms] = useState('');
  const [showTotalSummary, setShowTotalSummary] = useState(false);

  // --- Invoice terms and currency options ---
  const TERMS_OPTIONS = [
    'Due on Receipt',
    'Net 7',
    'Net 15',
    'Net 30',
    'Custom',
  ];
  const [customTerms, setCustomTerms] = useState('');
  const CURRENCY_OPTIONS = [
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  ];
  // Selected currency for the invoice
  const [currency, setCurrency] = useState('INR');
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol || '$';

  // --- Add state for showing the add customer modal and for the new customer form
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);

  // --- Fetch customers and next invoice number on mount ---
  useEffect(() => {
    // Fetch customers with 'customer' role from backend
    async function fetchCustomers() {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
      }
    }
    fetchCustomers();

    // Fetch next available invoice number
    async function fetchNextNumber() {
      const res = await fetch('/api/invoices/next-number');
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, number: data.number }));
      }
    }
    fetchNextNumber();
  }, []);

  // --- Form field change handlers ---
  // For text/textarea fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // If issue_date changes and a Net term is selected, recalculate due_date
      if (name === 'issue_date' && prev.payment_terms && prev.payment_terms.startsWith('Net ')) {
        const days = parseInt(prev.payment_terms.replace('Net ', ''));
        return { ...prev, issue_date: value, due_date: addDays(value, days) };
      }
      // If due_date is changed manually and payment_terms is Net N or Due on Receipt, set payment_terms to Custom
      if (name === 'due_date' && (prev.payment_terms && (prev.payment_terms.startsWith('Net ') || prev.payment_terms === 'Due on Receipt'))) {
        return { ...prev, due_date: value, payment_terms: 'Custom' };
      }
      return { ...prev, [name]: value };
    });
  };
  // For select fields
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // If payment_terms changes, update due_date accordingly
      if (name === 'payment_terms') {
        if (value.startsWith('Net ')) {
          const days = parseInt(value.replace('Net ', ''));
          return { ...prev, payment_terms: value, due_date: addDays(prev.issue_date, days) };
        } else if (value === 'Due on Receipt') {
          return { ...prev, payment_terms: value, due_date: prev.issue_date };
        } else {
          return { ...prev, payment_terms: value };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  // --- Invoice totals calculation ---
  // Subtotal: sum of (quantity * price) for all items
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  // Tax total: sum of tax for all items
  const taxTotal = items.reduce((sum, it) => sum + (it.quantity * it.unit_price * it.tax_rate) / 100, 0);
  // Grand total: subtotal + tax
  const grandTotal = subtotal + taxTotal;

  // --- Item table handlers ---
  // Add a new empty item row
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);
  };
  // Update a field in an item row
  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, [field]: field === 'description' ? value : Number(value) } : it
      )
    );
  };
  // Remove an item row
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  // --- Invoice form submission handler ---
  // Validates and submits the invoice to the backend
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

  // Helper to add days to a date string (YYYY-MM-DD)
  function addDays(dateStr: string, days: number) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().substr(0, 10);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-0 flex flex-col md:flex-row">
        {/* Left: Form Section */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">New Invoice</h1>
          <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-4">
            <div className="mb-4">
              <label className="block text-base font-medium mb-1 text-gray-800">
                Customer <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z"/></svg>
                  </span>
                  <select
                    name="customer_id"
                    value={form.customer_id}
                    onChange={e => handleSelectChange(e)}
                    className="w-full border px-10 py-3 rounded text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="">Search or select customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name ? `${c.name} (${c.email})` : c.email}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                  onClick={() => setShowAddCustomer(true)}
                >
                  <span className="text-lg">+</span> Add New Customer
                </button>
              </div>
              {showAddCustomer && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                  <div className="bg-white rounded shadow p-6 w-full max-w-sm">
                    <h3 className="font-semibold mb-2">Add New Customer</h3>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full border px-3 py-2 rounded mb-2"
                      value={newCustomer.name}
                      onChange={e => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border px-3 py-2 rounded mb-2"
                      value={newCustomer.email}
                      onChange={e => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        onClick={async () => {
                          setAddingCustomer(true);
                          const res = await fetch('/api/customers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newCustomer),
                          });
                          setAddingCustomer(false);
                          if (res.ok) {
                            const data = await res.json();
                            setCustomers(prev => [...prev, data.customer]);
                            setForm(prev => ({ ...prev, customer_id: data.customer.id }));
                            setShowAddCustomer(false);
                            setNewCustomer({ name: '', email: '' });
                          } else {
                            alert('Failed to add customer');
                          }
                        }}
                        disabled={addingCustomer || !newCustomer.email}
                      >
                        {addingCustomer ? 'Adding…' : 'Add Customer'}
                      </button>
                      <button
                        type="button"
                        className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                        onClick={() => setShowAddCustomer(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <button
                type="button"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1"
                onClick={() => setShowTerms((v) => !v)}
              >
                <span>+ Add Terms and conditions</span>
              </button>
              {showTerms && (
                <textarea
                  className="w-full border px-3 py-2 rounded mb-2"
                  placeholder="Enter terms and conditions"
                  value={terms}
                  onChange={e => setTerms(e.target.value)}
                />
              )}
              <button
                type="button"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1"
                onClick={() => setShowPaymentGateway((v) => !v)}
              >
                <span>+ Add Payment Gateway</span>
              </button>
              {showPaymentGateway && (
                <div className="w-full border px-3 py-2 rounded mb-2 text-gray-500 bg-gray-50">
                  Payment gateway integration coming soon.
                </div>
              )}
            </div>
            {/* Invoice Details Row with Currency Selector */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 rounded-lg p-4 border-b border-gray-200">
              {/* Currency Selector */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1 text-gray-800">Currency</label>
                <select
                  name="currency"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-base bg-white"
                >
                  {CURRENCY_OPTIONS.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Invoice Number */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded text-base bg-white"
                    readOnly={!isEditingNumber}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingNumber((v) => !v)}
                    className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
                    title={isEditingNumber ? 'Lock' : 'Edit'}
                  >
                    {isEditingNumber ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M12 16v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"/></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16.862 5.487a2.06 2.06 0 0 1 2.916 2.914l-9.375 9.375a2 2 0 0 1-.707.464l-3.11 1.037a.5.5 0 0 1-.632-.632l1.037-3.11a2 2 0 0 1 .464-.707l9.375-9.375Z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Issue Date */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"/></svg>
                  </span>
                  <input
                    type="date"
                    name="issue_date"
                    value={form.issue_date}
                    onChange={handleChange}
                    className="w-full border px-10 py-2 rounded text-base bg-white"
                    required
                  />
                </div>
              </div>
              {/* Terms */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1 text-gray-800">Terms</label>
                <select
                  name="payment_terms"
                  value={form.payment_terms}
                  onChange={handleSelectChange}
                  className="w-full border px-3 py-2 rounded text-base bg-white"
                >
                  <option value="">Select terms</option>
                  {TERMS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {form.payment_terms && !TERMS_OPTIONS.includes(form.payment_terms) && (
                  <input
                    type="text"
                    placeholder="Enter custom terms"
                    value={form.payment_terms}
                    onChange={e => setForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                    className="w-full border px-3 py-2 rounded mt-2 text-base bg-white"
                  />
                )}
              </div>
              {/* Due Date */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"/></svg>
                  </span>
                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    className="w-full border px-10 py-2 rounded text-base bg-white"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Item Table Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">Item Table</h2>
              </div>
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-7 gap-2 font-semibold text-xs mb-1 bg-gray-50 rounded-t-lg border-b border-gray-200">
                    <div className="col-span-2 py-3 px-2">Item Details</div>
                    <div className="py-3 px-2 text-right">Quantity</div>
                    <div className="py-3 px-2 text-right">Price</div>
                    <div className="py-3 px-2 text-right">Tax</div>
                    <div className="py-3 px-2 text-right">Tax Amount</div>
                    <div className="py-3 px-2 text-right">Total</div>
                    <div></div>
                  </div>
                  {items.length === 0 && <p className="text-sm text-gray-500 px-2 py-4">No items yet.</p>}
                  {items.map((item, idx) => {
                    const taxAmount = item.quantity * item.unit_price * item.tax_rate / 100;
                    const rowTotal = (item.quantity * item.unit_price) + taxAmount;
                    return (
                      <div
                        key={idx}
                        className={`mb-2 grid grid-cols-7 gap-2 items-center rounded-lg ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}
                      >
                        <input
                          placeholder="Description"
                          className="col-span-2 rounded border px-2 py-2 my-2 focus:ring-2 focus:ring-blue-500"
                          value={item.description}
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          className="rounded border px-2 py-2 my-2 text-right focus:ring-2 focus:ring-blue-500"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          min={1}
                        />
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-gray-500 text-sm">{currencySymbol}</span>
                          <input
                            type="number"
                            placeholder="Price"
                            step="0.01"
                            className="rounded border px-2 py-2 pl-6 w-full my-2 text-right focus:ring-2 focus:ring-blue-500"
                            value={item.unit_price}
                            onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                            min={0}
                          />
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            placeholder="Tax"
                            step="0.01"
                            className="rounded border px-2 py-2 pr-6 w-full my-2 text-right focus:ring-2 focus:ring-blue-500"
                            value={item.tax_rate}
                            onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
                            min={0}
                          />
                          <span className="absolute right-2 text-gray-500 text-sm">%</span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            className="rounded border px-2 py-2 bg-gray-100 text-right w-full my-2"
                            value={`${currencySymbol}${taxAmount.toFixed(2)}`}
                            readOnly
                            tabIndex={-1}
                            aria-label="Tax Amount"
                          />
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            className="rounded border px-2 py-2 bg-gray-100 text-right w-full my-2"
                            value={`${currencySymbol}${rowTotal.toFixed(2)}`}
                            readOnly
                            tabIndex={-1}
                            aria-label="Row Total"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="rounded border border-red-300 px-2 py-1 text-red-500 hover:bg-red-50 hover:border-red-500 transition"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded border border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium bg-white hover:bg-blue-50 transition"
                >
                  + Add New Row
                </button>
                <button
                  type="button"
                  className="rounded border border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium bg-white hover:bg-blue-50 transition"
                  onClick={e => { e.preventDefault(); alert('Bulk add not implemented yet.'); }}
                >
                  + Add Items in Bulk
                </button>
              </div>
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
        {/* Right: Summary Panel */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Summary</h2>
            <div className="mb-4">
              <div className="flex justify-between text-base mb-2">
                <span>Subtotal</span>
                <span>{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base mb-2">
                <span>Tax</span>
                <span>{currencySymbol}{taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-700 border-t pt-4 mt-4">
                <span>Total</span>
                <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
              onClick={() => setShowTotalSummary((v) => !v)}
            >
              {showTotalSummary ? 'Hide Total Summary ▲' : 'Show Total Summary ▼'}
            </button>
            {showTotalSummary && (
              <div className="mt-2 border-t pt-2 space-y-1 text-sm">
                <div>
                  <span className="font-medium">Subtotal:</span> {currencySymbol}{subtotal.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Tax:</span> {currencySymbol}{taxTotal.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Total:</span> {currencySymbol}{grandTotal.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 