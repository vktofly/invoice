// This layout is for authenticated/protected pages only. It includes Sidebar and Navbar.
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="w-full lg:ml-60">{children}</main>
      </div>
    </div>
  );
} 