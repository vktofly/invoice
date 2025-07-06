'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState('customer');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.admin.getUserById(params.id).then(({ data, error }) => {
      if (data?.user) {
        setUser(data.user);
        setRole(data.user.user_metadata?.role || 'customer');
      }
      setLoading(false);
    });
  }, [params.id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.auth.admin.updateUserById(params.id, {
      user_metadata: { role },
    });
    setSaving(false);
    if (error) setError(error.message);
    else router.push('/admin/users');
  };

  const remove = async () => {
    if (!confirm('Delete this user?')) return;
    await supabase.auth.admin.deleteUser(params.id);
    router.push('/admin/users');
  };

  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <p className="p-8">User not found.</p>;

  return (
    <div className="p-8 space-y-6 max-w-sm">
      <h1 className="text-2xl font-semibold">Edit User</h1>
      <div>
        <p className="mb-2 text-sm">{user.email}</p>
        <label className="block text-sm mb-1">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={saving} onClick={save} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save'}
      </button>
      <button onClick={remove} className="ml-4 rounded border px-4 py-2 text-red-600 hover:bg-red-50">
        Delete
      </button>
    </div>
  );
} 