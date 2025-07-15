// src/components/invoice/form/CoreDetails.tsx
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CoreDetailsProps {
  formState: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  customers: any[];
  handleCustomerChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  errors: any;
  billingAddresses: any[];
  shippingAddresses: any[];
  handleAddressChange: (type: 'billing' | 'shipping', addressId: string) => void;
  copyBillingToShipping: () => void;
  isCustomDueDate: boolean;
}

const CoreDetails: React.FC<CoreDetailsProps> = ({
  formState,
  handleInputChange,
  customers,
  handleCustomerChange,
  setIsModalOpen,
  errors,
  billingAddresses,
  shippingAddresses,
  handleAddressChange,
  copyBillingToShipping,
  isCustomDueDate,
}) => {
  return (
    <div className="p-4 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg space-y-4">
      <div className="flex justify-between items-center mb-2 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
          <h2 className="text-lg font-semibold">Core Details</h2>
      </div>
      
      <div className="pt-4">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Your Information</h3>
        <div className="space-y-4">
          <input type="text" name="user_company_name" placeholder="Your Company Name" value={formState.user_company_name} onChange={handleInputChange} className="input" />
          <input type="text" name="user_address" placeholder="Your Address, City, ZIP" value={formState.user_address} onChange={handleInputChange} className="input" />
          <input type="text" name="user_contact" placeholder="Your Email or Phone" value={formState.user_contact} onChange={handleInputChange} className="input" />
        </div>
      </div>

      <div className="pt-6 border-t border-white/20">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Customer Information</h3>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-600">Bill To</label>
          <button onClick={() => setIsModalOpen(true)} className="btn-secondary btn-sm"><PlusIcon className="h-4 w-4 mr-1" /> Add New Customer</button>
        </div>
        <select 
          id="customer_id"
          name="customer_id" 
          value={formState.customer_id} 
          onChange={handleCustomerChange} 
          className="input w-full"
        >
          <option value="">Select a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {(c.display_name || c.name) + (c.email ? ` (${c.email})` : '')}
            </option>
          ))}
        </select>
        {customers.length === 0 && (
          <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg text-sm">
              No customers found. Click the &apos;Add New&apos; button to create one.
          </div>
        )}
        {errors.customer_id && <p className="text-red-500 text-sm mt-1">{errors.customer_id}</p>}
      </div>

      {formState.customer_id && (
        <div className="pt-6 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="billing_address" className="block text-sm font-medium text-gray-600 mb-1">Billing Address</label>
              <select
                id="billing_address"
                value={formState.billing_address_id || ''}
                onChange={(e) => handleAddressChange('billing', e.target.value)}
                className="input w-full"
              >
                <option value="">Select Billing Address</option>
                {billingAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{`${addr.address_line1}, ${addr.city}`}</option>
                ))}
                <option value="add_new">+ Add New Address</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-600 mb-1">Shipping Address</label>
                <button type="button" onClick={copyBillingToShipping} className="text-xs text-indigo-500 hover:underline">Copy Billing</button>
              </div>
              <select
                id="shipping_address"
                value={formState.shipping_address_id || ''}
                onChange={(e) => handleAddressChange('shipping', e.target.value)}
                className="input w-full"
              >
                <option value="">Select Shipping Address</option>
                {shippingAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{`${addr.address_line1}, ${addr.city}`}</option>
                ))}
                <option value="add_new">+ Add New Address</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-4 text-gray-800">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="shipping_method" className="block text-sm font-medium text-gray-600 mb-1">Method</label>
                  <input id="shipping_method" type="text" name="shipping_method" placeholder="e.g. Courier" value={formState.shipping_method} onChange={handleInputChange} className="input" />
              </div>
              <div>
                  <label htmlFor="tracking_number" className="block text-sm font-medium text-gray-600 mb-1">Tracking #</label>
                  <input id="tracking_number" type="text" name="tracking_number" placeholder="Tracking Number" value={formState.tracking_number} onChange={handleInputChange} className="input" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/20">
          <div>
            <label htmlFor="issue_date" className="block text-sm font-medium text-gray-600 mb-1">Issue Date</label>
            <input 
              id="issue_date"
              type="date" 
              name="issue_date" 
              value={formState.issue_date} 
              onChange={handleInputChange} 
              className="input w-full" 
            />
          </div>
          {!formState.is_recurring && (
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
              <input 
                id="due_date"
                type="date" 
                name="due_date" 
                value={formState.due_date} 
                onChange={handleInputChange} 
                className="input w-full"
                readOnly={!isCustomDueDate}
              />
            </div>
          )}
        </div>
    </div>
  );
};

export default CoreDetails;