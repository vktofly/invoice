'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${error.message}`);
  }

  return redirect('/home');
}

export async function signUp(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/register?error=${error.message}`);
  }
  console.log({ data });
  return redirect('/register?message=Check email to continue sign in process');
}

export async function resetPassword(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    return redirect(`/reset-password?error=${error.message}`);
  }

  return redirect('/reset-password?message=Password reset link has been sent to your email.');
}

export async function updatePassword(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect(`/update-password?error=${error.message}`);
  }

  return redirect('/login?message=Your password has been updated successfully.');
}

export async function signOut() {
  const supabase = createSupabaseServerClient();

  await supabase.auth.signOut();
  return redirect('/login');
}