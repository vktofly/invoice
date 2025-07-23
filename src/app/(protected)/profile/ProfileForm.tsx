'use client';

import { useState, useEffect } from 'react';

export default function ProfileForm({ user, profile }: { user: any, profile: any }) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Profile Information</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input type="email" id="email" value={user?.email || ''} disabled className="input w-full bg-gray-200/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600 cursor-not-allowed" />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
          <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="input w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600" rows={3} />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
        {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${message.startsWith('Error:') ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700' : 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'}`}>
          {message}
        </div>
      )}
      </form>
    </div>
  );
}