'use client';

export default function AuditLogClientPage({ logs }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{log.user_id}</td>
                <td className="py-2 px-4 border-b">{log.action}</td>
                <td className="py-2 px-4 border-b">{JSON.stringify(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
