// Root layout: minimal, no sidebar or navbar. Used for (auth) and (protected) layouts.
import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

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
            {children}
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 