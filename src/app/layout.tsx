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
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-100 via-white to-cyan-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="min-h-screen text-gray-900 dark:text-gray-100 antialiased">
          <AuthProvider>
            <OrganizationProvider>
              {children}
            </OrganizationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
} 