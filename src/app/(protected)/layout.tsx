"use client";
import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCollapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.user_metadata?.role) {
      router.replace('/choose-role');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setCollapsed(!isCollapsed)} />
      <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar onMenuButtonClick={() => setCollapsed(!isCollapsed)} />
        <main className="flex-grow p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
} 