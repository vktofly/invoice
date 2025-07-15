'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import IndividualInvoicePageSkeleton from '@/components/skeletons/IndividualInvoicePageSkeleton';

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
    return <IndividualInvoicePageSkeleton />;
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
          {/* Header */}
          <div className="flex justify-between items-start pb-8 mb-8 border-b">
              <div>
                  <h2 className="text-2xl font-bold text-gray-800">{invoice.customer.name}</h2>
                  <p className="text-gray-600 text-sm">{invoice.customer.email}</p>
              </div>
              <div className="text-right">
                  <h1 className="text-4xl font-bold">INVOICE</h1>
                  <p className="text-gray-600 mt-1"># {invoice.number}</p>
                  <p className={`mt-2 px-2 py-1 inline-block text-sm rounded-full text-white ${
                      invoice.status === 'paid' ? 'bg-green-500' :
                      invoice.status === 'sent' ? 'bg-blue-500' :
                      invoice.status === 'overdue' ? 'bg-red-500' :
                      'bg-gray-500'
                  }`}>{invoice.status}</p>
              </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-8">
              <div>
                  <p className="font-semibold text-gray-800">Billed To:</p>
                  {invoice.billing_address ? (
                      <div className="text-gray-600">
                          <p>{invoice.billing_address.address_line1}</p>
                          <p>{invoice.billing_address.city}, {invoice.billing_address.state} {invoice.billing_address.postal_code}</p>
                      </div>
                  ) : <p className="text-gray-500">N/A</p>}
              </div>
              <div className="text-right">
                  <p className="font-semibold text-gray-800">Shipped To:</p>
                  {invoice.shipping_address ? (
                      <div className="text-gray-600">
                          <p>{invoice.shipping_address.address_line1}</p>
                          <p>{invoice.shipping_address.city}, {invoice.shipping_address.state} {invoice.shipping_address.postal_code}</p>
                      </div>
                  ) :  <p className="text-gray-500">N/A</p>}
              </div>
          </div>

          {/* Dates */}
          <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                  <p className="font-semibold text-gray-800">Invoice Date:</p>
                  <p className="text-gray-600">{new Date(invoice.issue_date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                  <p className="font-semibold text-gray-800">Due Date:</p>
                  <p className="text-gray-600">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mt-8">
              <table className="w-full text-left min-w-[600px]">
                  <thead>
                      <tr className="bg-gray-200">
                          <th className="p-3">Description</th>
                          <th className="p-3 text-right">Quantity</th>
                          <th className="p-3 text-right">Unit Price</th>
                          <th className="p-3 text-right">Tax Rate</th>
                          <th className="p-3 text-right">Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      {(invoice.invoice_items || []).map((item, i) => (
                          <tr key={i} className="border-b">
                              <td className="p-3">{item.description}</td>
                              <td className="p-3 text-right">{item.quantity}</td>
                              <td className="p-3 text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                              <td className="p-3 text-right">{item.tax_rate.toFixed(2)}%</td>
                              <td className="p-3 text-right">{currencySymbol}{item.line_total.toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                      <p>Subtotal:</p>
                      <p>{currencySymbol}{(invoice.subtotal || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                      <p>Tax:</p>
                      <p>{currencySymbol}{(invoice.tax_amount || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <p>Total:</p>
                      <p>{currencySymbol}{(invoice.total_amount || 0).toFixed(2)}</p>
                  </div>
              </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
              <div className="mt-8">
                  <p className="font-semibold text-gray-800">Notes:</p>
                  <p className="text-gray-600">{invoice.notes}</p>
              </div>
          )}
        </div>
      </div>
    </>
  );
}
