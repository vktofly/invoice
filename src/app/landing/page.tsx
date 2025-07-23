'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main app if the user is already logged in
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  // Render nothing or a loading spinner while checking auth status
  if (user) {
    return null; 
  }

  return (
    <div className="bg-background text-foreground font-sans">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;