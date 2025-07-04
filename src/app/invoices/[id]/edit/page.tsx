import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import supabase from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const EditInvoiceForm: any = dynamic(() => import('../EditInvoiceForm'), { ssr: false });

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error) throw new Error(error.message);
  if (!invoice) notFound();

  return <EditInvoiceForm invoice={invoice} />;
} 