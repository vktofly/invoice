import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * Props interface for the InvoicesPage component.
 * Allows for optional search parameters (status, customer).
 */
interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * InvoicesPage component
 * Server component that fetches and displays a list of invoices.
 * Supports optional filtering by status and customer via searchParams.
 */
export default async function InvoicesPage({ searchParams }: Props) {
  // Extract optional filters from searchParams
  const status = searchParams?.status as string | undefined;
  const customer = searchParams?.customer as string | undefined;

  // Get a Supabase server client
  const supabase = supabaseServer();
  // Build the query for invoices, ordering by issue_date descending
  let query = supabase
    .from('invoices')
    .select('id, number, total, status, issue_date, due_date')
    .order('issue_date', { ascending: false });

  // Apply filters if present
  if (status) query = query.eq('status', status);
  if (customer) query = query.eq('customer_id', customer);

  // Fetch the data from Supabase
  const { data, error } = await query;

  // Handle errors and empty data
  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <div className="p-6">
      {/* Header with title and New Invoice button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Link
          href="/invoices/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Invoice
        </Link>
      </div>

      {/* Invoices table */}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Number
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Issue Date
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Due Date
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Total
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render each invoice as a table row */}
          {data.map((inv) => (
            <tr key={inv.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {inv.number || inv.id.substring(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-2">{inv.issue_date}</td>
              <td className="px-4 py-2">{inv.due_date}</td>
              <td className="px-4 py-2">${inv.total}</td>
              <td className="px-4 py-2 capitalize">{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 