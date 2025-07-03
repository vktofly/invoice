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
  // The current search string in the customer input
  const [customerSearch, setCustomerSearch] = useState('');
  // Dropdown and modal state for customer selection
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const customerInputRef = useRef<HTMLInputElement>(null);
  // Modal state for adding a new customer
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);
  // Keyboard navigation for dropdown
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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

  // --- Close dropdown/modal when clicking outside ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close if click is outside the input or dropdown/modal
      if (
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target as Node)
      ) {
        setCustomerDropdownOpen(false);
        setShowAddCustomer(false);
      }
      const dropdown = document.querySelector('.customer-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setCustomerDropdownOpen(false);
        setShowAddCustomer(false);
      }
    }
    if (customerDropdownOpen || showAddCustomer) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [customerDropdownOpen, showAddCustomer]);

  // --- Form field change handlers ---
  // For text/textarea fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  // For select fields
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  // --- Add new customer handler ---
  // Calls backend to create a new customer, then selects it
  const handleAddCustomer = async () => {
    setAddingCustomer(true);
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    setAddingCustomer(false);
    if (res.ok) {
      const data = await res.json();
      setCustomers((prev) => [...prev, data.customer]);
      setForm((prev) => ({ ...prev, customer_id: data.customer.id }));
      setCustomerSearch(data.customer.name ? data.customer.name : data.customer.email);
      programmaticCustomerSetRef.current = true;
      setShowAddCustomer(false);
      setCustomerDropdownOpen(false);
      setNewCustomer({ name: '', email: '' });
      setHighlightedIndex(-1);
    } else {
      alert('Failed to add customer');
    }
  };

  // Add a flag to distinguish programmatic vs user input
  const programmaticCustomerSetRef = useRef(false);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">New Invoice</h1>
      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-4">
        <div className="mb-4 relative">
          <label className="block text-sm mb-1">Customer</label>
          <input
            type="text"
            ref={customerInputRef}
            placeholder="Search or select customer by name or email"
            value={customerSearch}
            onChange={e => {
              setCustomerSearch(e.target.value);
              setCustomerDropdownOpen(true);
              setHighlightedIndex(-1);
              // Only clear selection if this is a user-typed change
              if (!programmaticCustomerSetRef.current) {
                setForm(prev => ({ ...prev, customer_id: '' }));
              }
              programmaticCustomerSetRef.current = false;
            }}
            onFocus={() => setCustomerDropdownOpen(true)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="off"
            onKeyDown={e => {
              if (!customerDropdownOpen) return;
              const filtered = customers.filter(c =>
                c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                (c.name && c.name.toLowerCase().includes(customerSearch.toLowerCase()))
              );
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(idx => Math.min(idx + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(idx => Math.max(idx - 1, 0));
              } else if (e.key === 'Enter') {
                if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
                  const c = filtered[highlightedIndex];
                  setForm(prev => ({ ...prev, customer_id: c.id }));
                  setCustomerSearch(c.name ? c.name : c.email);
                  programmaticCustomerSetRef.current = true;
                  setCustomerDropdownOpen(false);
                  setHighlightedIndex(-1);
                }
              } else if (e.key === 'Escape') {
                setCustomerDropdownOpen(false);
                setHighlightedIndex(-1);
              }
            }}
          />
          {customerDropdownOpen && (
            <div className="customer-dropdown absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
              {customers
                .filter(c =>
                  c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                  (c.name && c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                )
                .map((c, i) => (
                  <div
                    key={c.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-indigo-100 ${form.customer_id === c.id ? 'bg-indigo-50' : ''} ${highlightedIndex === i ? 'bg-indigo-200' : ''}`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, customer_id: c.id }));
                      setCustomerSearch(c.name ? c.name : c.email);
                      programmaticCustomerSetRef.current = true;
                      setCustomerDropdownOpen(false);
                      setHighlightedIndex(-1);
                    }}
                  >
                    {c.name ? `${c.name} (${c.email})` : c.email}
                  </div>
                ))}
              <div className="px-3 py-2 cursor-pointer text-blue-600 hover:underline" onClick={() => setShowAddCustomer(true)}>
                + Add New Customer
              </div>
              {customers.filter(c =>
                c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                (c.name && c.name.toLowerCase().includes(customerSearch.toLowerCase()))
              ).length === 0 && !showAddCustomer && (
                <div className="px-3 py-2 text-gray-500">No customers found</div>
              )}
            </div>
          )}
          {showAddCustomer && (
            <div className="customer-dropdown absolute z-20 w-full bg-white border rounded shadow p-4 mt-2">
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
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleAddCustomer}
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
          )}
        </div>
        <div className="flex gap-4 items-end mb-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Currency</label>
            <select
              name="currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              {CURRENCY_OPTIONS.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm mb-1">Terms</label>
            <select
              name="payment_terms"
              value={TERMS_OPTIONS.includes(form.payment_terms) ? form.payment_terms : 'Custom'}
              onChange={e => {
                const value = e.target.value;
                if (value === 'Custom') {
                  setCustomTerms(form.payment_terms);
                }
                setForm(prev => ({ ...prev, payment_terms: value === 'Custom' ? customTerms : value }));
              }}
              className="w-full border px-3 py-2 rounded"
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
                className="w-full border px-3 py-2 rounded mt-2"
              />
            )}
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
            <h2 className="text-lg font-medium">Item Table</h2>
            <div className="flex gap-2 items-center">
              <a href="#" className="text-blue-600 text-sm hover:underline" onClick={e => e.preventDefault()}>
                Scan Item
              </a>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 font-semibold text-xs mb-1">
            <div className="col-span-2">Item Details</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Tax</div>
            <div>Tax Amount</div>
            <div>Total</div>
            <div></div>
          </div>
          {items.length === 0 && <p className="text-sm text-gray-500">No items yet.</p>}
          {items.map((item, idx) => {
            const taxAmount = item.quantity * item.unit_price * item.tax_rate / 100;
            const rowTotal = (item.quantity * item.unit_price) + taxAmount;
            return (
              <div key={idx} className="mb-2 grid grid-cols-7 gap-2">
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
                <div className="relative flex items-center">
                  <span className="absolute left-2 text-gray-500 text-sm">{currencySymbol}</span>
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    className="rounded border px-2 py-1 pl-6 w-full"
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
                    className="rounded border px-2 py-1 pr-6 w-full"
                    value={item.tax_rate}
                    onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
                    min={0}
                  />
                  <span className="absolute right-2 text-gray-500 text-sm">%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="rounded border px-2 py-1 bg-gray-100 text-right w-full"
                    value={`${currencySymbol}${taxAmount.toFixed(2)}`}
                    readOnly
                    tabIndex={-1}
                    aria-label="Tax Amount"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="rounded border px-2 py-1 bg-gray-100 text-right w-full"
                    value={`${currencySymbol}${rowTotal.toFixed(2)}`}
                    readOnly
                    tabIndex={-1}
                    aria-label="Row Total"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={addItem}
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            >
              + Add New Row
            </button>
            <button
              type="button"
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              onClick={e => { e.preventDefault(); alert('Bulk add not implemented yet.'); }}
            >
              + Add Items in Bulk
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-40 space-y-1 text-sm">
            <p>
              <strong>Total:</strong> {currencySymbol}{grandTotal.toFixed(2)}
            </p>
            <button
              type="button"
              className="text-blue-600 text-xs hover:underline mt-1"
              onClick={() => setShowTotalSummary((v) => !v)}
            >
              {showTotalSummary ? 'Hide Total Summary ▲' : 'Show Total Summary ▼'}
            </button>
            {showTotalSummary && (
              <div className="mt-2 border-t pt-2 space-y-1">
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
        <div>
          <label className="block text-sm mb-1">Customer Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
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
        <div>
          <label className="block text-sm mb-1">Invoice Number</label>
          <div className="flex items-center gap-2">
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              readOnly={!isEditingNumber}
              required
            />
            <button
              type="button"
              onClick={() => setIsEditingNumber((v) => !v)}
              className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
              title={isEditingNumber ? 'Lock' : 'Edit'}
            >
              {isEditingNumber ? '🔒' : '✏️'}
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
  );
} 