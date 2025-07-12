"use client";

import { useRouter } from 'next/navigation';
import { CreditCardIcon, CheckCircleIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function InvoiceActionsSidebar({ invoice }: { invoice: any }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      <div className="space-y-2">
        <button
          className="w-full btn-primary"
          disabled={invoice.status === 'paid'}
          onClick={() => router.push(`/invoices/${invoice.id}/pay`)}>
          <CreditCardIcon className="h-4 w-4" />
          Pay Now
        </button>
        <button className="w-full btn-secondary">
          <CheckCircleIcon className="h-4 w-4" />
          Mark as Paid
        </button>
        <button className="w-full btn-secondary">
          <PrinterIcon className="h-4 w-4" />
          Print Invoice
        </button>
      </div>
    </div>
  );
}