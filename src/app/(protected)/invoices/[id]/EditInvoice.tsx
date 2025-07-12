'use client';

import dynamic from 'next/dynamic';

const EditInvoiceForm = dynamic(() => import('./EditInvoiceForm'), { ssr: false });

export default function EditInvoice({ invoice }: { invoice: any }) {
  return <EditInvoiceForm invoice={invoice} />;
}
