// Root layout: minimal, no sidebar or navbar. Used for (auth) and (protected) layouts.
import './globals.css';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});
// import { createClient } from '@/lib/supabase/server'; // Temporarily disabled for debugging

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Generate and manage professional invoices',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const supabase = createClient(); // Temporarily disabled for debugging
  // const { data: { user } } = await supabase.auth.getUser(); // Temporarily disabled for debugging
  const user = null; // Temporarily hardcoded for debugging

  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-gradient-to-br from-indigo-100 via-white to-cyan-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="min-h-screen text-gray-900 dark:text-gray-100 antialiased">
          <AuthProvider initialUser={user}>
            <OrganizationProvider>
              {children}
            </OrganizationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}