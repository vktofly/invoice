'use client';
import Image from 'next/image';

const testimonials = [
  {
    quote: 'This is a game-changer. The interface is clean, the features are powerful, and it has saved me countless hours on billing.',
    author: 'Sarah Dayan',
    role: 'Founder, Design Studio',
    avatar: '/images/avatars/avatar-1.png',
  },
  {
    quote: 'As a freelancer, managing invoices was my biggest headache. InvoiceApp turned it into a seamless, almost enjoyable task. Highly recommended!',
    author: 'Alex Martinez',
    role: 'Freelance Developer',
    avatar: '/images/avatars/avatar-2.png',
  },
];

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <div className="p-8 rounded-2xl border border-white/10 bg-white/20 dark:border-gray-700/50 dark:bg-gray-800/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
    <p className="text-lg text-muted-foreground mb-6 relative">
      <span className="absolute -top-2 -left-4 text-6xl text-primary/20">“</span>
      {quote}
    </p>
    <div className="flex items-center">
      <Image src={avatar} alt={author} width={48} height={48} className="rounded-full mr-4" />
      <div>
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Trusted by growing businesses</h2>
          <p className="mt-4 text-lg text-muted-foreground">See why professionals are switching to a smarter, more elegant solution.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
