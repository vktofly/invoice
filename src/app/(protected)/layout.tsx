import { ReactNode } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';

import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch the user's role from the profiles table for security
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // If no profile or role, redirect to a safe page
  if (!profile?.role) {
    return redirect('/login');
  }

  return (
    <AuthProvider>
      <OrganizationProvider>
        <ProtectedPageWrapper user={user} userRole={profile.role}>
          {children}
        </ProtectedPageWrapper>
      </OrganizationProvider>
    </AuthProvider>
  );
}