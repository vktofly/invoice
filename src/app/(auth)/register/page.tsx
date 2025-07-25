'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signUp } from '../login/actions';
import { supabase } from '@/lib/supabase/client';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import React from 'react';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {

  

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const SocialButton = ({ provider, icon, label }: { provider: 'google' | 'apple' | 'facebook', icon: React.ReactElement, label: string }) => (
    <button
      type="button"
      onClick={() => handleOAuthSignIn(provider)}
      className="flex items-center justify-center w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-300"
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-600 text-white p-12">
        <div className="max-w-md text-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 mx-auto mb-6" />
          </Link>
          <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
          <p className="text-blue-200 text-lg">
            Join thousands of professionals who are streamlining their workflow.
          </p>
        </div>
      </div>

      {/* Right Panel (Registration Form) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Get Started</h2>
          <p className="text-slate-600 mb-8">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>

          {searchParams.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <p>{searchParams.error}</p>
            </div>
          )}
          {searchParams.message && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <p>{searchParams.message}</p>
            </div>
          )}

          <form action={signUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-slate-300" />
            <span className="mx-4 text-sm text-slate-500">Or sign up with</span>
            <div className="flex-grow border-t border-slate-300" />
          </div>

          <div className="space-y-4">
            <SocialButton provider="google" icon={<FcGoogle size={22} />} label="Sign up with Google" />
            <SocialButton provider="facebook" icon={<FaFacebook size={22} className="text-blue-800" />} label="Sign up with Facebook" />
            <SocialButton provider="apple" icon={<FaApple size={22} />} label="Sign up with Apple" />
          </div>
            <p className="text-xs text-slate-500 mt-6 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
        </div>
      </div>
    </div>
  );
}
