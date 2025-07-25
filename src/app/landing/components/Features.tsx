'use client';
import { FileText, Clock, Users, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: <FileText size={28} className="text-primary" />,
    title: 'Effortless Invoicing',
    description: 'Create and customize professional invoices in just a few clicks, with templates that reflect your brand.',
  },
  {
    icon: <Clock size={28} className="text-primary" />,
    title: 'Time-Saving Automation',
    description: 'Set up recurring invoices and automatic payment reminders to save time and reduce follow-ups.',
  },
  {
    icon: <Users size={28} className="text-primary" />,
    title: 'Client Management',
    description: 'Keep all your client information organized, accessible, and in one central location.',
  },
  {
    icon: <BarChart2 size={28} className="text-primary" />,
    title: 'Insightful Reporting',
    description: 'Track your income, expenses, and profitability with clear, concise, and actionable reports.',
  },
];

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/20 dark:border-gray-700/50 dark:bg-gray-800/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-x-0 top-[20rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[10rem]" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-[#0077ff] to-[#80ff89] opacity-20 sm:left-[calc(50%+20rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Everything you need, nothing you don&apos;t.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Focus on your work, not your paperwork. Our features are designed to be powerful yet intuitive.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
