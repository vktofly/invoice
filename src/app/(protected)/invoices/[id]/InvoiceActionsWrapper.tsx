'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import {
  CreditCardIcon,
  PencilIcon,
  ShareIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import InvoicePDFLink from './InvoicePDFLink';
import { Customer } from '@/lib/types';

interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  total_amount: number;
  currency: string;
  customer?: { name: string; email?: string };
  [key: string]: any;
}

const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return symbols[currency] || '$';
};

export default function InvoiceActionsWrapper({ invoice, customer }: { invoice: Invoice, customer: Customer }) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsPaying(true);
    setError(null);
    try {
      const orderRes = await fetch(`/api/invoices/${invoice.id}/create-payment-order`, {
        method: 'POST',
      });
      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || 'Failed to create payment order.');
      }
      const order = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Invoicer Inc.',
        description: `Payment for Invoice #${invoice.number}`,
        order_id: order.id,
        handler: (response: any) => {
          alert('Payment successful! Your invoice status will be updated shortly.');
          router.refresh();
        },
        prefill: {
          name: invoice.customer?.name || '',
          email: invoice.customer?.email || '',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to send invoice.');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const currencySymbol = getCurrencySymbol(invoice.currency);
  const canPay = invoice.status === 'sent' || invoice.status === 'overdue';

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex items-center gap-2">
        {error && <p className="text-red-500 text-sm mr-4">{error}</p>}
        
        {canPay && (
          <button
            onClick={handlePayment}
            disabled={isPaying}
            className="btn-primary bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            <CreditCardIcon className="h-5 w-5" />
            {isPaying ? 'Processing...' : `Pay ${currencySymbol}${(invoice.total_amount || 0).toFixed(2)}`}
          </button>
        )}

        <InvoicePDFLink invoice={invoice} customer={customer} />

        <button
          onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
          className="btn-secondary"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
        <button className="btn-secondary">
          <ShareIcon className="h-4 w-4" />
          Share
        </button>
        <button onClick={handleSendInvoice} className="btn-primary">
          <PaperAirplaneIcon className="h-4 w-4" />
          Send Invoice
        </button>
      </div>
    </>
  );
}