import React, { useState } from 'react';

type Customer = {
  id: string;
  name?: string;
  email: string;
};

type CustomerRowProps = {
  customers: Customer[];
  customerId: string;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddClick: () => void;
  showAddCustomer: boolean;
  newCustomer: { name: string; email: string };
  onNewCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCustomer: (allowLogin: boolean) => void;
  onCancelAdd: () => void;
  addingCustomer: boolean;
};

const CustomerRow: React.FC<CustomerRowProps> = ({
  customers = [],
  customerId = '',
  onSelect,
  onAddClick,
  showAddCustomer = false,
  newCustomer = { name: '', email: '' },
  onNewCustomerChange,
  onAddCustomer,
  onCancelAdd,
  addingCustomer = false,
}) => {
  const [allowLogin, setAllowLogin] = useState(false);
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
          onClick={onAddClick}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 8v8M8 12h8"/></svg>
          Add
        </button>
      </div>
      {showAddCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded border border-gray-200 p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-2 text-gray-900">Add New Customer</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border border-gray-300 px-3 py-2 rounded mb-2"
              value={newCustomer.name}
              onChange={onNewCustomerChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-3 py-2 rounded mb-2"
              value={newCustomer.email}
              onChange={onNewCustomerChange}
              required={allowLogin}
            />
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={allowLogin}
                onChange={e => setAllowLogin(e.target.checked)}
              />
              <span className="text-sm">Allow this customer to log in and view their invoices</span>
            </label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={() => onAddCustomer(allowLogin)}
                disabled={addingCustomer || !newCustomer.email || (allowLogin && !newCustomer.email)}
              >
                {addingCustomer ? 'Adding…' : 'Add Customer'}
              </button>
              <button
                type="button"
                className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={onCancelAdd}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRow; 