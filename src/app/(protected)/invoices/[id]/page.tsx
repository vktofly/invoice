import { getServerSupabase } from '@/lib/supabase/server-utils';
import Script from 'next/script';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import IndividualInvoicePageSkeleton from '@/components/skeletons/IndividualInvoicePageSkeleton';
import InvoiceTemplate from '@/components/invoice/InvoiceTemplate';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const InvoiceActionsWrapper = dynamic(() => import('./InvoiceActionsWrapper'), { ssr: false });

const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return symbols[currency] || '$';
};

async function getInvoice(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customer:customers(*), invoice_items(*), organization:organizations(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const invoice = await getInvoice(supabase, params.id);

  if (!invoice) {
    return <div className="text-center p-8">Invoice not found.</div>;
  }

  // Calculate totals (moved from useMemo)
  let sub = 0;
  let itemDiscountTotal = 0;
  let taxTotal = 0;
  invoice.invoice_items.forEach((item: any) => {
    const itemSubtotal = (item.quantity || 0) * (item.unit_price || 0);
    let itemDiscount = 0;
    if (item.discount_type === 'percentage') {
      itemDiscount = itemSubtotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      itemDiscount = item.discount_amount || 0;
    }
    const taxableAmount = itemSubtotal - itemDiscount;
    const taxAmount = taxableAmount * ((item.tax_rate || 0) / 100);
    sub += itemSubtotal;
    itemDiscountTotal += itemDiscount;
    taxTotal += taxAmount;
  });
  const totalAfterItemDiscounts = sub - itemDiscountTotal;
  const totalWithTax = totalAfterItemDiscounts + taxTotal;
  const totalWithShipping = totalWithTax + (invoice.shipping_cost || 0);
  let overallDisc = 0;
  if (invoice.discount_type === 'percentage') {
    overallDisc = totalWithShipping * ((invoice.discount_amount || 0) / 100);
  } else if (invoice.discount_type === 'fixed') {
    overallDisc = invoice.discount_amount || 0;
  }
  const grandTotal = totalWithShipping - overallDisc;
  const balDue = grandTotal + (invoice.customer?.outstanding_balance || 0);

  const currencySymbol = getCurrencySymbol(invoice.currency || 'USD');
  const customFieldsForTemplate = invoice.custom_fields
    ? Object.entries(invoice.custom_fields).map(([key, value]) => ({ key, value: String(value) }))
    : [];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/invoices" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Invoices
          </Link>
          <InvoiceActionsWrapper invoice={invoice} customer={invoice.customer} />
        </div>
        <InvoiceTemplate
          invoice={{
            ...invoice,
            items: invoice.invoice_items.map((item: any) => ({ ...item, tax_rate: item.tax_rate || 0 })),
            custom_fields: customFieldsForTemplate,
          }}
          customer={invoice.customer}
          organization={invoice.organization}
          subtotal={sub}
          totalItemDiscount={itemDiscountTotal}
          totalTax={taxTotal}
          overallDiscount={overallDisc}
          total={grandTotal}
          balanceDue={balDue}
          outstandingBalance={invoice.customer?.outstanding_balance || 0}
          currencySymbol={currencySymbol}
        />
      </div>
    </>
  );
}