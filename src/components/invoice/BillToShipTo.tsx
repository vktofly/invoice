import React, { useState, useEffect } from 'react';

// Define types for the component props and state
type Address = {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type Customer = {
  id: string;
  name?: string;
  email: string;
};

type BillToShipToProps = {
  customers: Customer[];
  customerId: string;
  form: any; // This should ideally be more specific, e.g., InvoiceFormType
  setForm: React.Dispatch<React.SetStateAction<any>>;
  fetchCustomers: () => Promise<void>;
};

const BillToShipTo: React.FC<BillToShipToProps> = ({ customers, customerId, form, setForm, fetchCustomers }) => {
  const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [manualBillingAddress, setManualBillingAddress] = useState(false);
  const [manualShippingAddress, setManualShippingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customer = customers.find(c => c.id === customerId);

  useEffect(() => {
    if (customerId) {
      fetchAddresses(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    // Initialize selected addresses if they exist in the form prop
    if (form.billing_address_id && billingAddresses.length > 0) {
      const initialBillingAddress = billingAddresses.find(addr => addr.id === form.billing_address_id);
      if (initialBillingAddress) {
        setSelectedBillingAddress(initialBillingAddress.id);
        setForm(prev => ({ ...prev, billing_address: initialBillingAddress }));
      }
    }
    if (form.shipping_address_id && shippingAddresses.length > 0) {
      const initialShippingAddress = shippingAddresses.find(addr => addr.id === form.shipping_address_id);
      if (initialShippingAddress) {
        setSelectedShippingAddress(initialShippingAddress.id);
        setForm(prev => ({ ...prev, shipping_address: initialShippingAddress }));
      }
    }
  }, [form.billing_address_id, form.shipping_address_id, billingAddresses, shippingAddresses, setForm]);

  const fetchAddresses = async (customerId: string) => {
    const res = await fetch(`/api/customers/${customerId}/addresses`);
    const data = await res.json();
    // Defensive: ensure data is always an array
    setBillingAddresses(Array.isArray(data) ? data : []);
    setShippingAddresses(Array.isArray(data) ? data : []);
  };

  const handleAddressChange = (type: 'billing' | 'shipping', value: string) => {
    if (value === 'manual') {
      if (type === 'billing') {
        setManualBillingAddress(true);
        setSelectedBillingAddress('manual');
        setForm(prev => ({ ...prev, billing_address_id: '', billing_address: null }));
      } else {
        setManualShippingAddress(true);
        setSelectedShippingAddress('manual');
        setForm(prev => ({ ...prev, shipping_address_id: '', shipping_address: null }));
      }
    } else {
      const address = (type === 'billing' ? billingAddresses : shippingAddresses).find(a => a.id === value);
      if (address) {
        setForm(prev => ({
          ...prev,
          [`${type}_address_id`]: address.id,
          [`${type}_address`]: address,
        }));
      }
      if (type === 'billing') {
        setManualBillingAddress(false);
        setSelectedBillingAddress(value);
      } else {
        setManualShippingAddress(false);
        setSelectedShippingAddress(value);
      }
    }
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = async (type: 'billing' | 'shipping') => {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/customers/${customerId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    });
    setSaving(false);
    if (res.ok) {
      const savedAddress = await res.json();
      fetchAddresses(customerId);
      if (type === 'billing') {
        setSelectedBillingAddress(savedAddress.address.id);
        setManualBillingAddress(false);
        setForm(prev => ({ ...prev, billing_address_id: savedAddress.address.id, billing_address: savedAddress.address }));
      } else {
        setSelectedShippingAddress(savedAddress.address.id);
        setManualShippingAddress(false);
        setForm(prev => ({ ...prev, shipping_address_id: savedAddress.address.id, shipping_address: savedAddress.address }));
      }
      setNewAddress({ address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' });
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save address');
    }
  };
  // Copy bill to address to ship to
  const copyBillToToShipTo = () => {
    const billingAddr = billingAddresses.find(addr => addr.id === selectedBillingAddress);
    if (billingAddr) {
      setForm((prev: any) => ({
        ...prev,
        shipping_address_id: billingAddr.id,
        shipping_address: billingAddr,
      }));
      setSelectedShippingAddress(billingAddr.id);
      setManualShippingAddress(false);
    }
  };

  return (
    <div className="w-full px-8 mb-10">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Bill To */}
        <div className="flex-1 bg-gray-50 p-4 border border-gray-200 min-h-[80px] flex flex-col justify-start rounded-md">
          <h3 className="font-semibold mb-2">Bill To</h3>
          {customer && (
            <>
              <select
                value={selectedBillingAddress}
                onChange={(e) => handleAddressChange('billing', e.target.value)}
                className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
              >
                <option value="">Select Billing Address</option>
                {billingAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{`${addr.address_line1}, ${addr.city}, ${addr.state}`}</option>
                ))}
                <option value="manual">+ Add New Address</option>
              </select>
              {!manualBillingAddress && form.billing_address && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>{form.billing_address.address_line1}</p>
                  {form.billing_address.address_line2 && <p>{form.billing_address.address_line2}</p>}
                  <p>{form.billing_address.city}, {form.billing_address.state} {form.billing_address.postal_code}</p>
                  <p>{form.billing_address.country}</p>
                </div>
              )}
            </>
          )}
          {manualBillingAddress && (
            <div className="space-y-2 mt-2">
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Address Line 1" name="address_line1" value={newAddress.address_line1} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Address Line 2 (Optional)" name="address_line2" value={newAddress.address_line2} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="City" name="city" value={newAddress.city} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="State" name="state" value={newAddress.state} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="ZIP Code" name="postal_code" value={newAddress.postal_code} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Country" name="country" value={newAddress.country} onChange={handleManualAddressChange} />
              <div className="flex gap-2">
                <button onClick={() => saveNewAddress('billing')} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</button>
                <button onClick={() => setManualBillingAddress(false)} className="bg-gray-200 px-3 py-1 rounded" disabled={saving}>Cancel</button>
              </div>
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
          )
          }
        </div>

        {/* Ship To */}
        <div className="flex-1 bg-gray-50 p-4 border border-gray-200 rounded-md">
          <h3 className="font-semibold mb-2">Ship To</h3>
          {customer && (
            <>
              <select
                value={selectedShippingAddress}
                onChange={(e) => handleAddressChange('shipping', e.target.value)}
                className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
              >
                <option value="">Select Shipping Address</option>
                {shippingAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{`${addr.address_line1}, ${addr.city}, ${addr.state}`}</option>
                ))}
                <option value="manual">+ Add New Address</option>
              </select>
              {!manualShippingAddress && form.shipping_address && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>{form.shipping_address.address_line1}</p>
                  {form.shipping_address.address_line2 && <p>{form.shipping_address.address_line2}</p>}
                  <p>{form.shipping_address.city}, {form.shipping_address.state} {form.shipping_address.postal_code}</p>
                  <p>{form.shipping_address.country}</p>
                </div>
              )}
            </>
          )}
          {manualShippingAddress && (
            <div className="space-y-2 mt-2">
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Address Line 1" name="address_line1" value={newAddress.address_line1} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Address Line 2 (Optional)" name="address_line2" value={newAddress.address_line2} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="City" name="city" value={newAddress.city} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="State" name="state" value={newAddress.state} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="ZIP Code" name="postal_code" value={newAddress.postal_code} onChange={handleManualAddressChange} />
              <input className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1" placeholder="Country" name="country" value={newAddress.country} onChange={handleManualAddressChange} />
              <div className="flex gap-2">
                <button onClick={() => saveNewAddress('shipping')} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</button>
                <button onClick={() => setManualShippingAddress(false)} className="bg-gray-200 px-3 py-1 rounded" disabled={saving}>Cancel</button>
              </div>
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillToShipTo; 