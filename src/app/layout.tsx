import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Generate and manage professional invoices',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <OrganizationProvider>
            <Navbar />
            <div className="flex pt-16">
              <Sidebar />
              <main className="w-full lg:ml-60">{children}</main>
            </div>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 