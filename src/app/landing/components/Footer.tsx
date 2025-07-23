'use client';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 dark:border-white/5">
      <div className="container mx-auto px-8 max-w-7xl py-8 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-4 sm:mb-0">
          &copy; {new Date().getFullYear()} InvoiceApp. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
