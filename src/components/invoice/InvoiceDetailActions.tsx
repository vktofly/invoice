'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PencilIcon,
  ShareIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AddPaymentModal from './AddPaymentModal';
import { InvoicePDFDownloader } from './InvoicePDFDownloader';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'viewed' | 'void';

type InvoiceDetailActionsProps = {
  invoice: {
    id: string;
    status: InvoiceStatus;
    total: number;
  };
};

export default function InvoiceDetailActions({ invoice }: InvoiceDetailActionsProps) {
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePaymentAdded = () => {
    router.refresh();
  };

  const handleSendInvoice = async () => {
    setIsSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to send invoice.');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('There was an error sending the invoice.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete invoice.');
      router.push('/invoices');
      router.refresh(); // To ensure the list is updated
    } catch (error) {
      console.error(error);
      alert('There was an error deleting the invoice.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/invoices/view/${invoice.id}`;
    navigator.clipboard.writeText(url);
    alert('Invoice link copied to clipboard!');
  };

  const canRecordPayment = invoice.status === 'sent' || invoice.status === 'overdue';
  const canSend = invoice.status === 'draft';
  const canEdit = invoice.status === 'draft' || invoice.status === 'sent';

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
        {canRecordPayment && (
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CreditCardIcon className="h-4 w-4" />
            Record Payment
          </button>
        )}
        {canSend && (
          <button onClick={handleSendInvoice} disabled={isSending} className="btn-primary flex items-center gap-2">
            <PaperAirplaneIcon className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Invoice'}
          </button>
        )}
        {canEdit && (
          <Link href={`/invoices/${invoice.id}/edit`} className="btn-secondary flex items-center gap-2">
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
        )}
        <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
          <ShareIcon className="h-4 w-4" />
          Share
        </button>
        <InvoicePDFDownloader invoiceId={invoice.id} variant="button" />
        <button
          onClick={handleDeleteInvoice}
          disabled={isDeleting}
          className="btn-danger flex items-center gap-2"
        >
          <TrashIcon className="h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {isPaymentModalOpen && (
        <AddPaymentModal
          invoiceId={invoice.id}
          balanceDue={invoice.total}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentAdded={handlePaymentAdded}
        />
      )}
    </>
  );
}