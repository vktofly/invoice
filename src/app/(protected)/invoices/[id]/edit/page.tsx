'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { Invoice } from '@/lib/types';

export default function EditInvoicePage() {
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
            throw new Error('Failed to fetch invoice data for editing.');
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
    return <div className="flex justify-center items-center h-screen">Loading invoice data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!invoice) {
    return <div className="flex justify-center items-center h-screen">Could not load invoice to edit.</div>;
  }

  return <InvoiceForm initialInvoice={invoice} />;
}