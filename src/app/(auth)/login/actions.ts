'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';

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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as string;

  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/register?error=${error.message}`);
  }

  // If signUp is successful and email confirmation is disabled, 
  // data.session will be populated. No need to sign in again.
  if (!data.session) {
    // This case handles if you re-enable email confirmation later
    return redirect('/login?message=Check email to complete registration');
  }

  return redirect('/post-login');
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