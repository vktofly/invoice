import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from './landing/components/Header';
import Hero from './landing/components/Hero';
import Features from './landing/components/Features';
import Testimonials from './landing/components/Testimonials';
import Footer from './landing/components/Footer';

export default async function Page() {
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/home');
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
}
