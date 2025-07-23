'use client';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="container mx-auto flex justify-between items-center p-3 rounded-2xl border border-white/10 bg-white/20 dark:border-gray-700/50 dark:bg-gray-800/20 backdrop-blur-xl shadow-lg">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="InvoiceApp Logo" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold text-foreground">InvoiceApp</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:bg-white/20 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:bg-white/20 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Testimonials</Link>
          <Link href="#pricing" className="hover:bg-white/20 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Pricing</Link>
        </nav>
        <div className="space-x-2">
          <Link href="/login" className="px-5 py-2.5 rounded-lg font-medium text-sm text-foreground bg-white/30 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/20 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 shadow-md">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
