// src/app/update-password/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UpdatePasswordForm from './UpdatePasswordForm';

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = createSupabaseServerClient();

  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // This could be a customized error page
    redirect('/login?message=Unable to verify your session. Please try logging in.');
  }

  return <UpdatePasswordForm />;
}
