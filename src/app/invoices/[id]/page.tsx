import Supabase from '@/lib/supabase/server';
import Link from 'next/link';
import InvoiceActions from './InvoiceActions';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

/**
 * PageProps interface for the InvoiceDetailPage component.
 * Expects a params object with the invoice id.
 */
interface PageProps {
  params: { id: string };
}

// Dynamically import the InvoicePDFDownload component (client-side only)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const InvoicePDFDownload: any = dynamic(() => import('./InvoicePDFDownload'), { ssr: false });

/**
 * InvoiceDetailPage component
 * Server component that fetches and displays the details of a single invoice.
 * Shows invoice metadata, items, notes, and action buttons.
 */
export default async function InvoiceDetailPage({ params }: PageProps) {
  // Get a Supabase server client
  const supabase = Supabase;
  // Fetch the invoice and its items by id
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  // Handle errors and missing invoice
  if (error) throw new Error(error.message);
  if (!invoice) notFound();

  // Extract items from the invoice
  const items = invoice.invoice_items || [];

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header with invoice number, back link, and PDF download */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Invoice {invoice.number ?? invoice.id.substring(0, 8)}
        </h1>
        <div className="flex gap-4">
          <Link href="/invoices" className="text-blue-600 hover:underline">
            ← All Invoices
          </Link>
          {/* PDF download button */}
          <InvoicePDFDownload invoice={invoice} items={items} />
        </div>
      </div>

      {/* Invoice metadata and items table */}
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
            {/* Render each invoice item as a table row */}
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

        {/* Optional notes section */}
        {invoice.notes && (
          <p className="mt-4 text-sm">
            <strong>Notes:</strong> {invoice.notes}
          </p>
        )}
      </div>

      {/* Action buttons (Send, Mark as Paid, Edit, etc.) */}
      <InvoiceActions id={invoice.id} status={invoice.status} />
    </div>
  );
} 