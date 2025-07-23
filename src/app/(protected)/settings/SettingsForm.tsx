'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function SettingsForm({ user }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    paymentReminders: true,
    marketingEmails: false,
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
    theme: 'light',
    date_format: 'MM/DD/YYYY',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      setSettings({
        emailNotifications: user.user_metadata?.emailNotifications ?? true,
        invoiceReminders: user.user_metadata?.invoiceReminders ?? true,
        paymentReminders: user.user_metadata?.paymentReminders ?? true,
        marketingEmails: user.user_metadata?.marketingEmails ?? false,
        currency: user.user_metadata?.currency || 'INR',
        timezone: user.user_metadata?.timezone || 'Asia/Kolkata',
        language: user.user_metadata?.language || 'en',
        theme: user.user_metadata?.theme || 'light',
        date_format: user.user_metadata?.date_format || 'MM/DD/YYYY',
      });
    }
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { ...settings },
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to delete account.');
      }

      await supabase.auth.signOut();
      router.replace('/login?message=Account deleted successfully.');

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and settings.</p>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' 
            : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Account Card */}
        <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Account</h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Profile Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details.</p>
            </div>
            <a href="/profile" className="btn-secondary">Manage Profile</a>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get emails about important account activity.</p>
              </div>
              <button onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Invoice Reminders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders for upcoming and overdue invoices.</p>
              </div>
              <button onClick={() => handleSettingChange('invoiceReminders', !settings.invoiceReminders)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.invoiceReminders ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.invoiceReminders ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Payment Reminders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when payments are due or received.</p>
              </div>
              <button onClick={() => handleSettingChange('paymentReminders', !settings.paymentReminders)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.paymentReminders ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.paymentReminders ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Marketing Emails</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive news, offers, and updates from us.</p>
              </div>
              <button onClick={() => handleSettingChange('marketingEmails', !settings.marketingEmails)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.marketingEmails ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Theme</label>
              <select id="theme" value={settings.theme} onChange={(e) => handleSettingChange('theme', e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label htmlFor="date_format" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date Format</label>
              <select id="date_format" value={settings.date_format} onChange={(e) => handleSettingChange('date_format', e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Currency</label>
              <select id="currency" value={settings.currency} onChange={(e) => handleSettingChange('currency', e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600">
                <option>INR</option>
                <option>USD</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Timezone</label>
              <select id="timezone" value={settings.timezone} onChange={(e) => handleSettingChange('timezone', e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600">
                <option>Asia/Kolkata</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Language</label>
              <select id="language" value={settings.language} onChange={(e) => handleSettingChange('language', e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600">
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-red-100/40 backdrop-blur-lg rounded-xl border border-red-200/20 shadow-lg p-6 dark:bg-red-900/20 dark:border-red-700/30">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-100/50 dark:bg-red-900/30">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
              <p className="text-sm text-red-700 dark:text-red-400">Permanently delete your account.</p>
            </div>
            <button onClick={handleDeleteAccount} className="btn-danger bg-red-500 hover:bg-red-600 flex items-center gap-2">
              <TrashIcon className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={handleSaveSettings} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}