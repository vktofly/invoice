'use client';

import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import IconWrapper from './IconWrapper';

const providerDetails = {
  google: {
    icon: <IconWrapper><FcGoogle className="w-6 h-6" /></IconWrapper>,
    label: 'Sign in with Google',
  },
  facebook: {
    icon: <IconWrapper><FaFacebook className="w-6 h-6 text-blue-800" /></IconWrapper>,
    label: 'Sign in with Facebook',
  },
  apple: {
    icon: <IconWrapper><FaApple className="w-6 h-6" /></IconWrapper>,
    label: 'Sign in with Apple',
  },
};

export const SocialButton = ({ provider }: { provider: 'google' | 'apple' | 'facebook' }) => {
  

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const { icon, label } = providerDetails[provider];

  return (
    <button
      type="button"
      onClick={() => handleOAuthSignIn(provider)}
      className="flex items-center justify-center w-full py-3 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-300"
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );
};
