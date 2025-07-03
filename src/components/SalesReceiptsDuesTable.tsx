/**
 * SalesReceiptsDuesTable component
 * Displays a table of sales, receipts, and dues for different periods.
 * Replace the placeholder data with real data from Supabase.
 */
export default function SalesReceiptsDuesTable() {
  // Placeholder data; replace with real fetch
  const periods = [
    { label: 'Today', sales: 0, receipts: 0, due: 0 },
    { label: 'This Week', sales: 0, receipts: 0, due: 0 },
    { label: 'This Month', sales: 0, receipts: 0, due: 0 },
    { label: 'This Quarter', sales: 0, receipts: 0, due: 0 },
    { label: 'This Year', sales: 0, receipts: 0, due: 0 },
  ];

  return (
    <section className="rounded-xl border bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2">Sales, Receipts, and Dues</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left font-medium text-gray-500"> </th>
            <th className="text-right font-medium text-gray-500">SALES</th>
            <th className="text-right font-medium text-gray-500">RECEIPTS</th>
            <th className="text-right font-medium text-gray-500">DUE</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((p) => (
            <tr key={p.label}>
              <td className="py-1 font-medium text-gray-700">{p.label}</td>
              <td className="py-1 text-right">₹{p.sales.toFixed(2)}</td>
              <td className="py-1 text-right">₹{p.receipts.toFixed(2)}</td>
              <td className="py-1 text-right">₹{p.due.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
} 