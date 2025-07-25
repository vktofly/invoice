'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RecurringInvoiceList({ recurringInvoices: initialRecurringInvoices }: { recurringInvoices: any[] }) {
  const [recurringInvoices, setRecurringInvoices] = useState(initialRecurringInvoices);

  const handleStatusChange = async (id: string, status: 'active' | 'paused' | 'cancelled') => {
    const res = await fetch(`/api/recurring-invoices/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updatedInvoice = await res.json();
      setRecurringInvoices(recurringInvoices.map(inv => inv.id === id ? updatedInvoice : inv));
    } else {
      // Handle error
      console.error('Failed to update status');
    }
  };

  const handleGenerateNow = async (id: string) => {
    const res = await fetch(`/api/recurring-invoices/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurring_invoice_id: id }),
    });

    if (res.ok) {
      // Optionally, refresh the list or show a success message
      console.log('Invoice generated successfully');
    } else {
      // Handle error
      console.error('Failed to generate invoice');
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
      {recurringInvoices.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p className="mb-2">No recurring invoices found.</p>
          <p>Start by creating a new recurring invoice to automate your billing.</p>
          {/* Potentially add a button to create a new recurring invoice here */}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {recurringInvoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link href={`/recurring-invoices/${invoice.id}/edit`} className="block hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {invoice.customers?.name || 'Unknown Customer'}
                    </p>
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'active' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-600">
                      Frequency: {invoice.frequency}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0 sm:ml-6">
                      Next due date: {new Date(invoice.next_generation_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
                    <p className="mr-4">Invoice #: {invoice.invoice_number}</p>
                    <p>Total: ${invoice.total_amount?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  {invoice.status === 'active' && (
                    <button onClick={() => handleStatusChange(invoice.id, 'paused')} className="btn-secondary btn-sm">Pause</button>
                  )}
                  {invoice.status === 'paused' && (
                    <button onClick={() => handleStatusChange(invoice.id, 'active')} className="btn-secondary btn-sm">Resume</button>
                  )}
                  {invoice.status !== 'cancelled' && (
                    <button onClick={() => handleStatusChange(invoice.id, 'cancelled')} className="btn-danger btn-sm">Cancel</button>
                  )}
                  <Link href={`/recurring-invoices/${invoice.id}/history`} className="btn-secondary btn-sm">History</Link>
                  <button onClick={() => handleGenerateNow(invoice.id)} className="btn-primary btn-sm">Generate Now</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
