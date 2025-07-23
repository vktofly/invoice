import { getServerSupabase } from '@/lib/supabase/server-utils';
import Link from 'next/link';

async function getCustomer(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const customer = await getCustomer(supabase, params.id);

  if (!customer) return <div className="p-8 text-center text-red-600">Customer not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-10">
      <Link href="/customer" className="mb-4 text-blue-600 hover:underline block">&larr; Back</Link>
      <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(customer).map(([key, value]) => (
          <div key={key}>
            <div className="text-gray-500 text-xs uppercase">{key.replace(/_/g, ' ')}</div>
            <div className="text-gray-900 font-medium">{String(value) || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 