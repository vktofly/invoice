'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import RoleProtected from '@/components/RoleProtected';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login');
        return;
      }
      
      const user = data.session.user;
      setUser(user);
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
      setLoading(false);
    });
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: formData.full_name }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            full_name: formData.full_name
          }
        });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.new_password
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setSaving(false);
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
    <RoleProtected allowedRoles={["user", "vendor", "customer"]}>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className="text-sm text-gray-600 capitalize">
                    {user?.user_metadata?.role || 'customer'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={saving || !formData.new_password || !formData.confirm_password}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </RoleProtected>
  );
} 