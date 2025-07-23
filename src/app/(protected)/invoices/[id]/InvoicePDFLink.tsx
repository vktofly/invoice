'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF'; // The new, redesigned PDF component
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Customer } from '@/lib/types';

interface InvoicePDFLinkProps {
  invoice: any;
  customer: Customer;
  className?: string;
}

export default function InvoicePDFLink({ invoice, customer, className }: InvoicePDFLinkProps) {
  const defaultClassName = "btn-secondary flex items-center gap-2";

  if (!invoice || !invoice.number || !invoice.invoice_items) {
    return (
      <button className={className || defaultClassName} disabled>
        <ArrowDownTrayIcon className="h-5 w-5" />
        Loading...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} customer={customer} />}
      fileName={`Invoice-${invoice.number}.pdf`}
    >
      <button className={className || defaultClassName}>
        <ArrowDownTrayIcon className="h-5 w-5" />
        Download PDF
      </button>
    </PDFDownloadLink>
  );
}

