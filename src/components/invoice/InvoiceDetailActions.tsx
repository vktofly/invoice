'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PencilIcon,
  ShareIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import AddPaymentModal from './AddPaymentModal';

type InvoiceDetailActionsProps = {
  invoiceId: string;
  invoiceStatus: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  balanceDue: number;
};

export default function InvoiceDetailActions({ invoiceId, invoiceStatus, balanceDue }: InvoiceDetailActionsProps) {
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentAdded = (newPayment: any) => {
    console.log('Payment added:', newPayment);
    router.refresh();
  };
  
  const canRecordPayment = invoiceStatus === 'sent' || invoiceStatus === 'overdue';

  return (
    <>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        {canRecordPayment && (
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CreditCardIcon className="h-4 w-4" />
            Record Payment
          </button>
        )}
        <Link href={`/invoices/${invoiceId}/edit`} className="btn-secondary">
          <PencilIcon className="h-4 w-4" />
          Edit
        </Link>
        <button className="btn-secondary">
          <ShareIcon className="h-4 w-4" />
          Share
        </button>
        <button className="btn-primary">
          <PaperAirplaneIcon className="h-4 w-4" />
          Send Invoice
        </button>
      </div>

      {isPaymentModalOpen && (
        <AddPaymentModal
          invoiceId={invoiceId}
          balanceDue={balanceDue}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentAdded={handlePaymentAdded}
        />
      )}
    </>
  );
};
