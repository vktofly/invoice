'use client';
import React, { useEffect } from 'react';
import { FiFileText, FiClock, FiUsers, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);
  // --- Design System ---
  const colors = {
    bg: 'bg-slate-50', // Off-white background
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentBgHover: 'hover:bg-blue-700',
    cardBg: 'bg-white',
    border: 'border-slate-200',
  };

  const dotPattern = {
    backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)',
    backgroundSize: '20px 20px',
  };

  // --- Components ---
  const FeatureCard = ({ icon, title, children }) => (
    <div className={`${colors.cardBg} p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border ${colors.border}`}>
      <div className={`${colors.accent} mb-5`}>{icon}</div>
      <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-3`}>{title}</h3>
      <p className={colors.textSecondary}>{children}</p>
    </div>
  );

  const TestimonialCard = ({ quote, author, role }) => (
    <div className={`${colors.cardBg} p-8 rounded-xl shadow-sm border ${colors.border} relative`}>
      <div className={`absolute top-0 left-8 w-0.5 h-full bg-gradient-to-b from-blue-200 to-transparent`}></div>
      <div className={`absolute top-8 left-0 h-0.5 w-full bg-gradient-to-r from-blue-200 to-transparent`}></div>
      <p className={`text-lg italic ${colors.textSecondary} mb-6 pl-8`}>&quot;{quote}&quot;</p>
      <div className="pl-8">
        <p className={`font-semibold ${colors.textPrimary}`}>{author}</p>
        <p className={colors.textSecondary}>{role}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.textPrimary} font-sans`}>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-slate-50/80 border-b ${colors.border}">
        <div className="container mx-auto flex justify-between items-center max-w-7xl p-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8" />
            <span className="text-xl font-bold">InvoiceApp</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-base font-medium ${colors.textSecondary}">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</Link>
          </nav>
          <div className="space-x-4">
            <Link href="/login" className={`px-5 py-2 rounded-lg font-medium ${colors.textSecondary} hover:bg-slate-200 transition-colors`}>Login</Link>
            <Link href="/register" className={`px-5 py-2 rounded-lg ${colors.accentBg} text-white font-semibold ${colors.accentBgHover} transition-colors shadow-sm`}>Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20" style={dotPattern}>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight mb-6 ${colors.textPrimary}`}>
            Modern Invoicing, <span className={colors.accent}>Simplified</span>.
          </h1>
          <p className={`text-lg md:text-xl ${colors.textSecondary} mb-10 max-w-2xl mx-auto`}>
            Create beautiful invoices, automate your workflow, and get paid faster. Our platform is designed for professionals who value precision and elegance.
          </p>
          <Link href="/register" className={`px-8 py-3 rounded-full ${colors.accentBg} text-white text-lg font-semibold ${colors.accentBgHover} transition-all duration-300 shadow-lg shadow-blue-500/20`}>
            Get Started for Free
          </Link>
          <div className="mt-16">
            <Image
              src="/images/full image.png"
              alt="App Screenshot"
              width={1024}
              height={576}
              className="rounded-lg shadow-2xl mx-auto border-4 ${colors.border}"
            />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`text-4xl font-bold ${colors.textPrimary}`}>Everything you need, nothing you don&apos;t.</h2>
            <p className={`mt-4 text-lg ${colors.textSecondary}`}>Focus on your work, not your paperwork. Our features are designed to be powerful yet intuitive.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<FiFileText size={28} />} title="Effortless Invoicing">
              Create and customize professional invoices in just a few clicks.
            </FeatureCard>
            <FeatureCard icon={<FiClock size={28} />} title="Time-Saving Automation">
              Set up recurring invoices and automatic payment reminders.
            </FeatureCard>
            <FeatureCard icon={<FiUsers size={28} />} title="Client Management">
              Keep all your client information organized and accessible.
            </FeatureCard>
            <FeatureCard icon={<FiBarChart2 size={28} />} title="Insightful Reporting">
              Track your income and expenses with clear, concise reports.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className={`text-4xl font-bold ${colors.textPrimary}`}>Trusted by growing businesses</h2>
            <p className={`mt-4 text-lg ${colors.textSecondary}`}>See why professionals are switching to a smarter solution.</p>
          </div>
          <TestimonialCard
            quote="This is a game-changer. The interface is clean, the features are powerful, and it has saved me countless hours on billing."
            author="Sarah Dayan"
            role="Founder, Design Studio"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-white border-t ${colors.border}`}>
        <div className="container mx-auto px-8 max-w-7xl py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
             <p className={colors.textPrimary}>&copy; {new Date().getFullYear()} InvoiceApp. All rights reserved.</p>
          </div>
          <div className={`flex space-x-6 ${colors.textSecondary}`}>
            <Link href="#" className="hover:text-blue-600">Terms</Link>
            <Link href="#" className="hover:text-blue-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;