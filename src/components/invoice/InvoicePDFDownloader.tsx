'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import InvoicePDF from '@/app/(protected)/invoices/[id]/InvoicePDF';

interface InvoicePDFDownloaderProps {
  invoiceId: string;
  variant?: 'button' | 'icon';
}

export function InvoicePDFDownloader({ invoiceId, variant = 'icon' }: InvoicePDFDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick events
    setLoading(true);
    try {
      // 1. Fetch the complete invoice data
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch invoice data for PDF generation.');
      }
      const invoiceData = await res.json();

      // 2. Generate the PDF blob
      const blob = await pdf(<InvoicePDF invoice={invoiceData} />).toBlob();

      // 3. Trigger the download
      saveAs(blob, `Invoice-${invoiceData.number}.pdf`);

    } catch (error) {
      console.error('PDF Download Error:', error);
      alert('Could not download the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-secondary flex items-center gap-2"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="p-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300"
      title="Download PDF"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <ArrowDownTrayIcon className="h-5 w-5" />
      )}
    </button>
  );
}
