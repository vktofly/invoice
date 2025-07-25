'use client';
import { UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import EmptyState from './EmptyState';
import { TopCustomersSkeleton } from './skeletons/TopCustomersSkeleton';

type TopCustomer = {
  customer_id: string;
  name: string;
  total_invoiced: number;
};

async function fetchData(): Promise<TopCustomer[]> {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 4000));
  return [
    { customer_id: '1', name: 'Alpha Creations', total_invoiced: 12500 },
    { customer_id: '2', name: 'Beta Solutions', total_invoiced: 9800 },
    { customer_id: '3', name: 'Gamma Innovations', total_invoiced: 7600 },
    { customer_id: '4', name: 'Delta Services', total_invoiced: 5400 },
  ];
}

export default function TopCustomers() {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <TopCustomersSkeleton />;
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={<UserPlusIcon className="h-10 w-10" />}
        title="No customers yet"
        description="Add your first customer to see them here."
        action={{
          label: 'Add Customer',
          onClick: () => console.log('Redirect to /customers/new'), // Placeholder
        }}
      />
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Customers</h3>
        <UserGroupIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <ul className="divide-y divide-border">
        {customers.map(customer => (
          <li key={customer.customer_id} className="py-3 flex justify-between items-center">
            <span className="font-medium text-foreground">{customer.name}</span>
            <span className="font-mono text-muted-foreground">
              ₹{customer.total_invoiced.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}