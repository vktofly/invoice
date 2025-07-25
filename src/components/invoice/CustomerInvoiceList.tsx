"use client";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  number: string;
  issue_date: string;
  status: string;
  total: number;
}

export default function CustomerInvoiceList({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();

  if (invoices.length === 0) {
      return (
          <div className="max-w-3xl mx-auto py-8 px-4">
              <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
              <div className="text-gray-500">No invoices found. When your vendor issues you an invoice, it will appear here.</div>
          </div>
      )
  }

  return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold">Invoice #</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Download</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-4 py-2">{inv.number}</td>
                    <td className="px-4 py-2">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 capitalize">{inv.status}</td>
                    <td className="px-4 py-2">₹{inv.total?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => router.push(`/invoices/${inv.id}/download`)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
  );
}
