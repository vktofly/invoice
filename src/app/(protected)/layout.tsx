"use client";
// This layout is for authenticated/protected pages only. It includes Sidebar and Navbar.
import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !user.user_metadata?.role) {
      router.replace('/choose-role');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div>
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="w-full lg:ml-64">{children}</main>
      </div>
    </div>
  );
} 