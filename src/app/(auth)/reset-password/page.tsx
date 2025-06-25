'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {sent ? (
        <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow">
          <p className="mb-4 text-gray-700">Password reset email sent to {email}. Check your inbox.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow">
          <h1 className="text-xl font-semibold text-center">Reset Password</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
} 