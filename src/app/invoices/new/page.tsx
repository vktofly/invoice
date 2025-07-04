'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import InvoiceHeader from '@/components/invoice/InvoiceHeader';
import CustomerRow from '@/components/invoice/CustomerRow';
import MetadataGrid from '@/components/invoice/MetadataGrid';
import BillToShipTo from '@/components/invoice/BillToShipTo';
import ItemTable from '@/components/invoice/ItemTable';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import NotesTermsPayment from '@/components/invoice/NotesTermsPayment';
import TotalSummary from '@/components/invoice/TotalSummary';


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
  place_of_supply: z.string().optional(),
  po_number: z.string().optional(),
  ship_to_name: z.string().optional(),
  ship_to_address: z.string().optional(),
  ship_to_city: z.string().optional(),
  ship_to_state: z.string().optional(),
  ship_to_zip: z.string().optional(),
  ship_to_country: z.string().optional(),
  ship_to_gstin: z.string().optional(),
  subject: z.string().optional(),
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
    place_of_supply: '',
    po_number: '',
    ship_to_name: '',
    ship_to_address: '',
    ship_to_city: '',
    ship_to_state: '',
    ship_to_zip: '',
    ship_to_country: '',
    ship_to_gstin: '',
    subject: '',
  } as any);
  // Holds the list of invoice line items
  const [items, setItems] = useState<z.infer<typeof ItemSchema>[]>([]);
  // Error and loading state for form submission
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Customer selection and search state ---
  // List of all customers fetched from backend
  const [customers, setCustomers] = useState<{ id: string; email: string; name?: string; address?: string; city?: string; state?: string; zip?: string; country?: string; gstin?: string }[]>([]);

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

  // --- New state for discount and TDS/TCS ---
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const [tdsOrTcs, setTdsOrTcs] = useState<'TDS' | 'TCS'>('TDS');
  const [tdsOrTcsRate, setTdsOrTcsRate] = useState(0);

  // --- Fetch customers and next invoice number on mount ---
    async function fetchCustomers() {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
      }
    }

  useEffect(() => {
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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

  // Discount
  const discountAmount = discountType === 'percent'
    ? subtotal * (discountValue / 100)
    : discountValue;
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);

  // TDS/TCS
  const tdsOrTcsAmount = discountedSubtotal * (tdsOrTcsRate / 100);

  // Final total
  const finalTotal = Math.max(discountedSubtotal - tdsOrTcsAmount, 0);

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

  const moveItem = (fromIdx: number, toIdx: number) => {
    setItems(prev => {
      const updated = Array.from(prev);
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

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
    <div className="max-w-7xl mx-auto bg-transparent p-0">
      <div className="max-w-5xl mx-auto w-full px-0 py-0">
        {/* Header */}
        <InvoiceHeader />
        <div className="mb-12" />

        {/* Customer Row */}
        <CustomerRow
          customers={customers}
          customerId={form.customer_id}
          onSelect={handleSelectChange}
          onAddClick={() => setShowAddCustomer(true)}
          showAddCustomer={showAddCustomer}
          newCustomer={newCustomer}
          onNewCustomerChange={e => {
            const { name, value } = e.target;
            setNewCustomer(prev => ({ ...prev, [name]: value }));
          }}
          onAddCustomer={async () => {
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
          onCancelAdd={() => setShowAddCustomer(false)}
          addingCustomer={addingCustomer}
        />
        <div className="mb-12" />

        {/* Metadata Grid */}
        <MetadataGrid
          number={form.number}
          isEditingNumber={isEditingNumber}
          onNumberChange={handleChange}
          onEditNumber={() => setIsEditingNumber((v) => !v)}
          issueDate={form.issue_date}
          onIssueDateChange={handleChange}
          paymentTerms={form.payment_terms}
          onPaymentTermsChange={handleSelectChange}
          termsOptions={TERMS_OPTIONS}
          dueDate={form.due_date}
          onDueDateChange={handleChange}
        />
        <div className="mb-12" />

        {/* Bill To / Ship To */}
        <div className="px-8">
          <BillToShipTo
            customers={customers}
            customerId={form.customer_id}
            form={form}
            handleChange={handleChange}
            setForm={setForm}
            fetchCustomers={fetchCustomers}
          />
        </div>
        <div className="mb-12" />

        {/* Item Table */}
        <div className="px-8">
          <ItemTable
            items={items.map(item => ({
              description: item.description ?? '',
              quantity: item.quantity ?? 0,
              unit_price: item.unit_price ?? 0,
              tax_rate: item.tax_rate ?? 0,
            }))}
            updateItem={updateItem}
            removeItem={removeItem}
            addItem={addItem}
            moveItem={moveItem}
            currencySymbol={currencySymbol}
            grandTotal={grandTotal}
          />
          <TotalSummary
            subtotal={subtotal}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
            tdsOrTcs={tdsOrTcs}
            setTdsOrTcs={setTdsOrTcs}
            tdsOrTcsRate={tdsOrTcsRate}
            setTdsOrTcsRate={setTdsOrTcsRate}
            discountAmount={discountAmount}
            discountedSubtotal={discountedSubtotal}
            tdsOrTcsAmount={tdsOrTcsAmount}
            finalTotal={finalTotal}
            currencySymbol={currencySymbol}
            showTotalSummary={showTotalSummary}
            setShowTotalSummary={setShowTotalSummary}
          />
        </div>
        <div className="mb-12" />

        {/* Notes, Terms, Payment Gateway */}
        <div className="px-8">
          <NotesTermsPayment
            notes={form.notes || ''}
            setNotes={notes => setForm(prev => ({ ...prev, notes }))}
            showTerms={showTerms}
            setShowTerms={setShowTerms}
            terms={terms}
            setTerms={setTerms}
            showPaymentGateway={showPaymentGateway}
            setShowPaymentGateway={setShowPaymentGateway}
          />
        </div>
        <div className="mb-12" />

        {/* Action Buttons */}
        <InvoiceActions
          loading={loading}
          onSaveDraft={handleSubmit}
          onSaveAndSend={(e) => {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent, 'sent');
          }}
        />
      </div>
    </div>
  );
} 