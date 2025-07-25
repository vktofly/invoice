'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Settings {
  default_tax: number;
  currency: string;
  bank_details: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    default_tax: 0,
    currency: 'USD',
    bank_details: '',
  });
  

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings({
        default_tax: data.default_tax ?? 0,
        currency: data.currency ?? 'USD',
        bank_details: data.bank_details ?? '',
      });
      setLoading(false);
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ id: 1, ...settings });
    setSaving(false);
    setError(error ? error.message : null);
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-xl space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Invoice Settings</h1>
      <div className="rounded border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm mb-1">Default Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded border px-3 py-2"
            value={settings.default_tax}
            onChange={(e) => setSettings({ ...settings, default_tax: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Currency</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Bank / Payment Details</label>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={settings.bank_details}
            onChange={(e) => setSettings({ ...settings, bank_details: e.target.value })}
          />
        </div>
        <button
          disabled={saving}
          onClick={save}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
 