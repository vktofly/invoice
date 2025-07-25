"use client";
import React from 'react';
import AddCustomerModal from './AddCustomerModal';

type Customer = {
  id: string;
  name?: string;
  email: string;
};

type CustomerRowProps = {
  customers: Customer[];
  customerId: string;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddCustomer: (customer: any) => Promise<void>;
  showAddCustomer: boolean;
  setShowAddCustomer: (show: boolean) => void;
};

const CustomerRow: React.FC<CustomerRowProps> = ({
  customers = [],
  customerId = '',
  onSelect,
  onAddCustomer,
  showAddCustomer,
  setShowAddCustomer,
}) => {
  return (
    <div className="w-full px-8 mb-8">
      <label className="block text-base font-medium mb-1 text-gray-800 font-sans">
        <span className="text-red-500">Customer Name*</span>
      </label>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <select
            name="customer_id"
            value={customerId}
            onChange={onSelect}
            className="w-full border border-gray-300 px-10 py-3 rounded text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white font-sans"
            required
          >
            <option value="">Select or add a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name ? `${c.name} (${c.email})` : c.email}
              </option>
            ))}
          </select>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z"/></svg>
          </span>
        </div>
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
          onClick={() => setShowAddCustomer(true)}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 8v8M8 12h8"/></svg>
          Add
        </button>
      </div>
      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onAddCustomer={(customer) => onAddCustomer(customer)}
        />
      )}
    </div>
  );
};

export default CustomerRow;