'use client';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <main className="relative isolate pt-32 pb-20 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ff89] to-[#0077ff] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Effortless Invoicing for Modern Business
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Create stunning invoices in seconds, automate your billing, and get paid faster. Join thousands of professionals who trust InvoiceApp for its elegance and precision.
          </p>
          <Link 
            href="/register" 
            className="inline-block px-8 py-4 rounded-lg bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 shadow-lg"
          >
            Get Started for Free
          </Link>
        </div>
        
        <div className="mt-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <div className="p-2 rounded-2xl bg-white/20 dark:bg-black/20 border border-white/10 dark:border-white/5 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <Image
              src="/images/full-image.png"
              alt="InvoiceApp Dashboard Screenshot"
              width={1024}
              height={576}
              className="rounded-lg border border-border/20"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
