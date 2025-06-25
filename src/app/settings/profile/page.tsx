'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState({
    full_name: '',
    company: '',
    address: '',
  });
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ newPwd: '', confirm: '' });

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email || '');
      setProfile({
        full_name: user.user_metadata.full_name || '',
        company: user.user_metadata.company || '',
        address: user.user_metadata.address || '',
      });
      setLoading(false);
    }
    load();
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    setSuccess(false);
    const { error } = await supabase.auth.updateUser({
      data: profile,
    });
    setSaving(false);
    if (error) setError(error.message);
    else {
      setError(null);
      setSuccess(true);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPwd.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (passwords.newPwd !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.newPwd });
    setSaving(false);
    if (error) setError(error.message);
    else {
      setError(null);
      setSuccess(true);
      setPasswords({ newPwd: '', confirm: '' });
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>

      {/* Personal details */}
      <section className="rounded border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Personal & Billing Info</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Full Name</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Company</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Billing Address</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <button
            disabled={saving}
            onClick={handleProfileSave}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>

      {/* Password */}
      <section className="rounded border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">New Password</label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              value={passwords.newPwd}
              onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          <button
            disabled={saving}
            onClick={handlePasswordChange}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved!</p>}
    </div>
  );
} 