export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 lg:ml-60">
      <h1 className="text-4xl font-bold">Invoice Generator SaaS</h1>
      <p className="text-gray-600">Create, send, and manage invoices effortlessly.</p>
      <a
        href="/login"
        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
      >
        Get Started
      </a>
    </main>
  );
} 