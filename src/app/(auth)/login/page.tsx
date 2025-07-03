"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/dashboard');
      }
    });

    // Listen to future sign-ins
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Ensure the user has a role
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.user_metadata.role) {
          await supabase.auth.updateUser({
            data: { role: 'customer' }
          });
        }
        router.replace('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          redirectTo={
            typeof window !== 'undefined'
              ? `${window.location.origin}/dashboard`
              : undefined
          }
        />
        <p className="mt-4 text-center text-sm">
          <a href="/reset-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
} 