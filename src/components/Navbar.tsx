"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // initial
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    // listen changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <Link href="/" className="text-lg font-semibold text-indigo-600">
        InvoiceApp
      </Link>
      {loggedIn ? (
        <button
          onClick={handleLogout}
          className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Login
        </Link>
      )}
    </header>
  );
} 