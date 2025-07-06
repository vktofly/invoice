import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Server-side: use service role key to list users
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function AdminUsersPage() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link href="/(protected)/admin/users/new" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Add User
        </Link>
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.user_metadata?.role ?? '—'}</td>
              <td className="px-4 py-2">{u.confirmed_at ? 'Active' : 'Invited'}</td>
              <td className="px-4 py-2 space-x-2 text-right">
                <Link href={`/admin/users/${u.id}`} className="text-indigo-600 underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 