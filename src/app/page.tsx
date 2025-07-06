'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading) return null;

  // Simple marketing landing page for unauthenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-indigo-700">Welcome to InvoiceApp</h1>
        <p className="text-gray-600 mb-8">Modern invoicing, billing, and business management for teams and freelancers.</p>
        <div className="flex flex-col gap-3">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Sign In</button>
          <button className="bg-white border border-indigo-600 text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">Sign Up</button>
        </div>
        <div className="mt-8 text-xs text-gray-400">&copy; {new Date().getFullYear()} InvoiceApp. All rights reserved.</div>
      </div>
    </div>
  );
} 