import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import InvoiceDetailActions from '@/components/invoice/InvoiceDetailActions';
import InvoiceTemplate from '@/components/invoice/InvoiceTemplate';
import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';
import { Database } from '@/types/db';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];

async function getInvoice(id: string): Promise<(Invoice & { customer: Customer | null; invoice_items: InvoiceItem[] }) | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers (*),
      invoice_items (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }

  if (data) {
    data.invoice_items = data.invoice_items || [];
  }

  return data;
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  if (!invoice) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <InvoiceTemplate
          number={invoice.number}
          issue_date={invoice.issue_date}
          due_date={invoice.due_date}
          items={invoice.invoice_items}
          notes={invoice.notes}
          logo_url={invoice.logo_url}
          color_theme={invoice.color_theme}
          user_company_name={invoice.user_company_name}
          user_address={invoice.user_address}
          user_contact={invoice.user_contact}
          currency={invoice.currency}
          authorized_signature={invoice.authorized_signature}
          billing_address={invoice.customer?.address}
          shipping_address={invoice.customer?.address}
          customer={invoice.customer}
          // The following props are calculated in the InvoiceTemplate, so we can pass dummy values
          subtotal={0}
          totalItemDiscount={0}
          totalTax={0}
          overallDiscount={0}
          total={0}
          balanceDue={0}
          outstandingBalance={0}
          currencySymbol={'$'}
        />
      </div>

      <div className="mt-8">
        <InvoiceDetailActions invoice={invoice} />
      </div>
    </div>
  );
}