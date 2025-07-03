"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { BellIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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
      {/* Search bar center */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring"
        />
      </div>
      {/* Right section */}
      <div className="flex items-center gap-4 ml-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <PlusIcon className="h-6 w-6 text-indigo-600" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-500" />
        </button>
        <div className="rounded-full bg-gray-200 p-1">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </header>
  );
} 