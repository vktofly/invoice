import dynamic from 'next/dynamic';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const EditInvoiceForm: any = dynamic(() => import('./EditInvoiceForm'), { ssr: false });

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error) throw new Error(error.message);
  if (!invoice) notFound();

  return <EditInvoiceForm invoice={invoice} />;
} 