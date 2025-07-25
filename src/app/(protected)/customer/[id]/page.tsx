import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

const DetailItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
  </div>
);

const AddressDetail = ({ title, address }: { title: string, address: any }) => (
  <div>
    <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
    <address className="mt-2 not-italic text-gray-600">
      <p>{address.attention}</p>
      <p>{address.address1}</p>
      {address.address2 && <p>{address.address2}</p>}
      <p>{address.city}, {address.state} {address.pin}</p>
      <p>{address.country}</p>
      {address.phone && <p>Phone: {address.phone}</p>}
    </address>
  </div>
);

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const customer = await getCustomerData(params.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.display_name}</h1>
              <p className="text-sm font-medium text-gray-500">{customer.company_name}</p>
            </div>
            <Link href={`/customer/${customer.id}/edit`} className="btn-secondary">
                Edit Customer
            </Link>
          </div>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5" />
              <a href={`mailto:${customer.email}`} className="hover:underline">{customer.email}</a>
            </div>
            {customer.work_phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>{customer.work_phone}</span>
              </div>
            )}
            {customer.mobile && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>{customer.mobile} (mobile)</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <dl className="divide-y divide-gray-200">
            <DetailItem label="Customer Type" value={customer.customer_type} />
            <DetailItem label="Primary Contact" value={`${customer.salutation} ${customer.first_name} ${customer.last_name}`} />
            <DetailItem label="Currency" value={customer.currency} />
            <DetailItem label="Payment Terms" value={customer.payment_terms} />
          </dl>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t">
          <AddressDetail title="Billing Address" address={{
            attention: customer.billing_attention,
            address1: customer.billing_address1,
            address2: customer.billing_address2,
            city: customer.billing_city,
            state: customer.billing_state,
            pin: customer.billing_pin,
            country: customer.billing_country,
            phone: customer.billing_phone
          }}/>
          <AddressDetail title="Shipping Address" address={{
            attention: customer.shipping_attention,
            address1: customer.shipping_address1,
            address2: customer.shipping_address2,
            city: customer.shipping_city,
            state: customer.shipping_state,
            pin: customer.shipping_pin,
            country: customer.shipping_country,
            phone: customer.shipping_phone
          }}/>
        </div>

        <div className="p-6 border-t">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Financial & Tax Information</h3>
            <dl className="mt-4 divide-y divide-gray-200">
                <DetailItem label="GSTIN" value={customer.gstin} />
                <DetailItem label="PAN" value={customer.pan} />
            </dl>
        </div>

        {/* Placeholder for invoices list */}
        <div className="p-6 border-t">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Invoices</h3>
            <p className="mt-2 text-sm text-gray-500">A list of invoices for this customer will be displayed here.</p>
        </div>
      </div>
    </div>
  );
} 