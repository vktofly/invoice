"use client";
import React from 'react';
import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';

export const InvoiceList = ({ title, invoices }) => (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
        <ul className="divide-y divide-white/20 dark:divide-gray-700">
            {invoices.map(invoice => (
                <li key={invoice.id} className="py-3 flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{invoice.number} - {invoice.customer}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(invoice.created_at).toLocaleDateString()} - ₹{invoice.amount}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
                        }`}>
                            {invoice.status}
                        </span>
                        <InvoicePDFDownloader invoiceId={invoice.id} />
                    </div>
                </li>
            ))}
        </ul>
    </div>
);