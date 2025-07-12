'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CustomerRegistrationForm from '@/components/CustomerRegistrationForm';

export default function EditCustomerPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const res = await fetch(`/api/customers/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch customer data.');
          }
          const data = await res.json();
          setCustomer(data.customer);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto p-8">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-5xl mx-auto p-8 text-red-500">{error}</div>;
  }

  if (!customer) {
    return <div className="max-w-5xl mx-auto p-8">Customer not found.</div>;
  }

  return <CustomerRegistrationForm customer={customer} />;
}