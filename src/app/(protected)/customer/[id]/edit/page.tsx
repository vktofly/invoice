import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CustomerRegistrationForm from '@/components/CustomerRegistrationForm';

async function getCustomerData(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Failed to fetch customer:', error);
    notFound();
  }
  return data;
}

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customer = await getCustomerData(params.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <CustomerRegistrationForm customer={customer} />
    </div>
  );
} 