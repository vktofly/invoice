"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const roles = [
  { value: 'customer', label: 'Customer' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'admin', label: 'Admin' },
];

export default function EditAdminUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/users/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          setRole(data.user.user_metadata?.role || 'customer');
        } else {
          setError('User not found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch user.');
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user.');
      }
      setSuccess('User updated successfully!');
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">User not found.</div>;

  return (
    <div className="p-8 space-y-6 max-w-sm">
      <h1 className="text-2xl font-semibold">Edit User</h1>
      <div>
        <p className="mb-2 text-sm">{user.email}</p>
        <label className="block text-sm mb-1">Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <button
        disabled={saving}
        onClick={handleSave}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
} 