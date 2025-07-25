'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    notify_paid: true,
    notify_due: true,
    notify_promotions: false,
  });
  const [message, setMessage] = useState<string | null>(null);

  

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setPrefs({
          notify_paid: user.user_metadata.notify_paid ?? true,
          notify_due: user.user_metadata.notify_due ?? true,
          notify_promotions: user.user_metadata.notify_promotions ?? false,
        });
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: prefs });
    setSaving(false);
    setMessage(error ? error.message : 'Saved');
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-lg space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Notification Settings</h1>
      <div className="rounded border bg-white p-6 shadow-sm">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={prefs.notify_paid}
            onChange={(e) => setPrefs({ ...prefs, notify_paid: e.target.checked })}
          />
          <span>Email me when invoices are paid</span>
        </label>
        <label className="mt-4 flex items-center space-x-3">
          <input
            type="checkbox"
            checked={prefs.notify_due}
            onChange={(e) => setPrefs({ ...prefs, notify_due: e.target.checked })}
          />
          <span>Remind me before invoices are due</span>
        </label>
        <label className="mt-4 flex items-center space-x-3">
          <input
            type="checkbox"
            checked={prefs.notify_promotions}
            onChange={(e) => setPrefs({ ...prefs, notify_promotions: e.target.checked })}
          />
          <span>Send me product updates & promotions</span>
        </label>
        <button
          disabled={saving}
          onClick={save}
          className="mt-6 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
} 