'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import RoleProtected from '@/components/RoleProtected';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    paymentReminders: true,
    marketingEmails: false,
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login');
        return;
      }
      
      setUser(data.session.user);
      setLoading(false);
    });
  }, [router]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // In a real app, you'd save these to a user_settings table
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      if (error) throw error;
      
      router.replace('/login');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete account' });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Invoice Reminders</h3>
                  <p className="text-sm text-gray-500">Get reminded about unpaid invoices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.invoiceReminders}
                    onChange={(e) => handleSettingChange('invoiceReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Reminders</h3>
                  <p className="text-sm text-gray-500">Receive payment due reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.paymentReminders}
                    onChange={(e) => handleSettingChange('paymentReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive updates about new features</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Cog6ToothIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Currency
                </label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCardIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Billing</h2>
            </div>

            <div className="text-center py-8">
              <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No billing information</h3>
              <p className="text-gray-500 mb-4">Add your billing information to manage subscriptions</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Add Billing Info
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Active Sessions</h3>
                  <p className="text-sm text-gray-500">Manage your active login sessions</p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </RoleProtected>
  );
}
