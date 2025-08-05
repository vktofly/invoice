// Import necessary libraries and components.
// createSupabaseServerClient is used for server-side Supabase interactions.
// notFound is a Next.js function to render a 404 page.
// Heroicons are used for UI icons.
// Link is used for client-side navigation.
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * Fetches detailed data for a specific customer from the Supabase database.
 * @param id - The unique identifier of the customer to fetch.
 * @returns A promise that resolves to the customer's data.
 * If the customer is not found or an error occurs, it triggers a 404 page.
 */
async function getCustomerData(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  // If there's an error or no data is returned, log the error and show a 404 page.
  if (error || !data) {
    console.error('Failed to fetch customer:', error);
    notFound();
  }
  return data;
}

/**
 * A reusable component to display a single detail item in a structured layout.
 * It consists of a label and a value, arranged in a grid for alignment.
 * @param label - The title of the detail (e.g., "Customer Type").
 * @param value - The value of the detail to display. If null or undefined, it defaults to 'N/A'.
 */
const DetailItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
  </div>
);

/**
 * A component to render a formatted address block.
 * @param title - The title for the address block (e.g., "Billing Address").
 * @param address - An object containing the address details.
 */
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

/**
 * The main page component for displaying a single customer's profile.
 * This is a server component, so it fetches data directly on the server.
 * @param params - The page parameters, containing the customer's ID from the URL.
 */
export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  // Fetch the customer data based on the ID from the URL.
  const customer = await getCustomerData(params.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
        {/* Header Section: Displays customer's name, company, and an edit button. */}
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
          {/* Contact Information Section */}
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

        {/* Core Details Section: Displays primary contact, currency, payment terms, etc. */}
        <div className="p-6">
          <dl className="divide-y divide-gray-200">
            <DetailItem label="Customer Type" value={customer.customer_type} />
            <DetailItem label="Primary Contact" value={`${customer.salutation} ${customer.first_name} ${customer.last_name}`} />
            <DetailItem label="Currency" value={customer.currency} />
            <DetailItem label="Payment Terms" value={customer.payment_terms} />
          </dl>
        </div>
        
        {/* Address Section: Displays billing and shipping addresses side-by-side. */}
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

        {/* Financial & Tax Information Section */}
        <div className="p-6 border-t">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Financial & Tax Information</h3>
            <dl className="mt-4 divide-y divide-gray-200">
                <DetailItem label="GSTIN" value={customer.gstin} />
                <DetailItem label="PAN" value={customer.pan} />
            </dl>
        </div>

        {/* Placeholder for future implementation of an invoices list for the customer. */}
        <div className="p-6 border-t">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Invoices</h3>
            <p className="mt-2 text-sm text-gray-500">A list of invoices for this customer will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}