import supabase from '@/lib/supabase/server';

export default async function AuditLogPage() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Audit Log</h1>
      <table className="min-w-full text-sm bg-white rounded shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Time</th>
            <th className="px-3 py-2 text-left">User</th>
            <th className="px-3 py-2 text-left">Action</th>
            <th className="px-3 py-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-3 py-2">{new Date(row.created_at).toLocaleString()}</td>
              <td className="px-3 py-2">{row.user_email || row.user_id}</td>
              <td className="px-3 py-2">{row.action}</td>
              <td className="px-3 py-2 whitespace-pre-wrap">{row.details}</td>
            </tr>
          ))}
          {data?.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                No logs.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 