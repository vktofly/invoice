import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import InvoiceActions from './InvoiceActions';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

interface PageProps {
  params: { id: string };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const InvoicePDFDownload: any = dynamic(() => import('./InvoicePDFDownload'), { ssr: false });

export default async function InvoiceDetailPage({ params }: PageProps) {
  const supabase = supabaseServer();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error) throw new Error(error.message);
  if (!invoice) notFound();

  const items = invoice.invoice_items || [];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Invoice {invoice.number ?? invoice.id.substring(0, 8)}
        </h1>
        <div className="flex gap-4">
          <Link href="/invoices" className="text-blue-600 hover:underline">
            ← All Invoices
          </Link>
          {/* PDF download */}
          <InvoicePDFDownload invoice={invoice} items={items} />
        </div>
      </div>

      <div className="rounded bg-white p-6 shadow">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Status:</strong>{' '}
            <span className="capitalize">{invoice.status}</span>
          </p>
          <p>
            <strong>Total:</strong> ${invoice.total}
          </p>
          <p>
            <strong>Issue:</strong> {invoice.issue_date}
          </p>
          <p>
            <strong>Due:</strong> {invoice.due_date}
          </p>
        </div>

        {/* Items table */}
        <table className="mt-6 w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2 text-right">Qty</th>
              <th className="px-2 py-2 text-right">Unit</th>
              <th className="px-2 py-2 text-right">Tax %</th>
              <th className="px-2 py-2 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={it.id ?? it.description} className="border-t">
                <td className="px-2 py-2">{it.description}</td>
                <td className="px-2 py-2 text-right">{it.quantity}</td>
                <td className="px-2 py-2 text-right">${it.unit_price}</td>
                <td className="px-2 py-2 text-right">{it.tax_rate}</td>
                <td className="px-2 py-2 text-right">${it.line_total?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoice.notes && (
          <p className="mt-4 text-sm">
            <strong>Notes:</strong> {invoice.notes}
          </p>
        )}
      </div>

      {/* action buttons */}
      <InvoiceActions id={invoice.id} status={invoice.status} />
    </div>
  );
} 