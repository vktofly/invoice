
import { redirect } from 'next/navigation';

export default function ViewInvoiceRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/invoices/${params.id}`);
}
