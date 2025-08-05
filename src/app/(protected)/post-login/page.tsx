'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function PostLoginPage() {
  const [message, setMessage] = useState('Please wait, verifying your session...');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const processUser = async () => {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Authentication error. Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      setMessage('Session verified. Checking your profile...');
      const { user } = session;

      // Fetch user role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError || !roleData) {
        setError('Could not retrieve your user role. Please try again.');
        return;
      }

      const userRole = roleData.role;

      // Fetch user profile to get the organization
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Could not retrieve your user profile. Please try again.');
        return;
      }

      // --- ROLE-BASED LOGIC ---

      if (userRole === 'customer') {
        // Customer role: Redirect straight to their portal.
        setMessage('Redirecting to your customer portal...');
        router.push('/portal');
        return;
      }

      if (userRole === 'user') {
        // User role: Check for an organization.
        if (profile.organization_id) {
          // Organization already exists. Redirect to the main dashboard.
          setMessage('Organization found. Redirecting to the dashboard...');
          router.push('/invoices');
        } else {
          // No organization linked. This should not happen with the new sign-up flow,
          // but we can handle it as a fallback.
          setMessage('No organization linked. Please contact support.');
        }
        return;
      }

      // Fallback for any other unexpected role
      setError(`Unknown role: ${userRole}. Please contact support.`);
    };

    processUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1>{message}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>You will be redirected shortly.</p>
    </div>
  );
}
