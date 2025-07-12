'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import InvoicePageSkeleton from '@/components/skeletons/InvoicePageSkeleton';

// Dynamically import the new client-side component
const InvoiceActionsWrapper = dynamic(() => import('./InvoiceActionsWrapper'), {
  ssr: false,
  loading: () => <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse" />,
});

// Define the types for the data you expect
interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  customer: { name: string; email: string };
  billing_address: { address_line1: string, city: string, state: string, postal_code: string };
  shipping_address: { address_line1: string, city: string, state: string, postal_code: string };
  invoice_items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  currency: string;
}

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return symbols[currency] || '$';
};


export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/invoices/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch invoice details.');
          }
          return res.json();
        })
        .then((data) => {
          setInvoice(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <InvoicePageSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  if (!invoice) {
    return <div className="text-center p-8">Invoice not found.</div>;
  }

  const currencySymbol = getCurrencySymbol(invoice.currency);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Invoices
          </button>
          <InvoiceActionsWrapper invoice={invoice} />
        </div>

        <div className="p-8 bg-white/60 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
          {/* ... content of the invoice ... */}
          <div className="text-center mt-8">
            {/* Payment button is now inside InvoiceActionsWrapper */}
          </div>
        </div>
      </div>
    </>
  );
}
