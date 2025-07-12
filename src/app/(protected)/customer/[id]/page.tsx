'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  name: string;
  email: string;
  // Add other customer properties here
  [key: string]: any; // Allows for other dynamic properties
}

const CustomerDetailsPage = ({ params }: { params: any }) => {
  const { id } = params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { id } = params;
    async function fetchCustomer() {
      // Reset states on new ID
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch customer data.');
        }
        const data = await res.json();
        console.log('Fetched customer data:', data);
        setCustomer(data.customer || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [params]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!customer) return <div className="p-8 text-center text-red-600">Customer not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-10">
      <button className="mb-4 text-blue-600 hover:underline" onClick={() => router.back()}>&larr; Back</button>
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
};

export default CustomerDetailsPage; 