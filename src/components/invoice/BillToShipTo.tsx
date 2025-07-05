import React, { useState } from 'react';

type Customer = {
  id: string;
  name?: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  gstin?: string;
};

type BillToShipToProps = {
  customers: Customer[];
  customerId: string;
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  fetchCustomers: () => Promise<void>;
};

const BillToShipTo: React.FC<BillToShipToProps> = ({ customers, customerId, form, handleChange, setForm, fetchCustomers }) => {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [addressFields, setAddressFields] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    gstin: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customer = customers.find(c => c.id === customerId);

  // Initialize address fields when editing
  const initializeAddressFields = () => {
    if (customer) {
      setAddressFields({
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip ? customer.zip.toString() : '', // Convert bigint to string
        country: customer.country || '',
        gstin: customer.gstin ? customer.gstin.toString() : '', // Convert bigint to string
      });
    }
  };

  // Save address to customer record
  async function saveAddress() {
    setSaving(true);
    setError(null);
    
    // Prepare data for API - handle bigint fields properly
    const apiData = {
      address: addressFields.address || '',
      city: addressFields.city || '',
      state: addressFields.state || '',
      zip: addressFields.zip || '', // Send as string, API will convert to bigint
      country: addressFields.country || '',
      gstin: addressFields.gstin || '', // Send as string, API will convert to bigint
    };
    
    const res = await fetch(`/api/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });
    
    setSaving(false);
    if (res.ok) {
      setShowAddAddress(false);
      setShowEditAddress(false);
      await fetchCustomers();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save address');
    }
  }

  // Copy bill to address to ship to
  const copyBillToToShipTo = () => {
    if (!customer) return;
    setForm((prev: any) => ({
      ...prev,
      ship_to_name: customer.name || '',
      ship_to_address: customer.address || '',
      ship_to_city: customer.city || '',
      ship_to_state: customer.state || '',
      ship_to_zip: customer.zip ? customer.zip.toString() : '', // Convert bigint to string
      ship_to_country: customer.country || '',
      ship_to_gstin: customer.gstin ? customer.gstin.toString() : '', // Convert bigint to string
    }));
  };

  return (
    <div className="w-full px-8 mb-10">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Bill To */}
        <div className="flex-1 bg-gray-50 p-4 border border-gray-200 min-h-[80px] flex flex-col justify-start rounded-md">
          <h3 className="font-semibold mb-2">Bill To</h3>
          {(() => {
            if (!customer) return <div className="text-gray-400 italic">No customer selected</div>;
            
            const hasAddress = customer.address || customer.city || customer.state || customer.zip || customer.country || customer.gstin;
            
            if (!hasAddress && !showAddAddress) {
              return (
                <div>
                  <div className="text-gray-400 italic mb-2">No address on file</div>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setShowAddAddress(true)}
                  >
                    + Add Address
                  </button>
                </div>
              );
            }

            if (showAddAddress || showEditAddress) {
              return (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await saveAddress();
                  }}
                  className="space-y-2 mt-2"
                >
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="Address"
                    value={addressFields.address}
                    onChange={e => setAddressFields(f => ({ ...f, address: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="City"
                    value={addressFields.city}
                    onChange={e => setAddressFields(f => ({ ...f, city: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="State"
                    value={addressFields.state}
                    onChange={e => setAddressFields(f => ({ ...f, state: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="ZIP Code"
                    value={addressFields.zip}
                    onChange={e => setAddressFields(f => ({ ...f, zip: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="Country"
                    value={addressFields.country}
                    onChange={e => setAddressFields(f => ({ ...f, country: e.target.value }))}
                  />
                  <input
                    className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
                    placeholder="GSTIN"
                    value={addressFields.gstin}
                    onChange={e => setAddressFields(f => ({ ...f, gstin: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button 
                      type="button" 
                      className="bg-gray-200 px-3 py-1 rounded" 
                      onClick={() => {
                        setShowAddAddress(false);
                        setShowEditAddress(false);
                      }} 
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <div className="text-red-600 mt-2">{error}</div>}
                </form>
              );
            }

            return (
              <>
                <div className="mb-1 font-bold">{customer.name || ''}</div>
                <div className="text-sm text-gray-700 mb-1">{customer.address || ''}</div>
                <div className="text-sm text-gray-700 mb-1">
                  {customer.city || ''} {customer.state || ''} {customer.zip || ''}
                </div>
                <div className="text-sm text-gray-700 mb-1">{customer.country || ''}</div>
                <div className="text-sm text-gray-700 mb-1">GSTIN {customer.gstin || ''}</div>
                <button
                  className="text-blue-600 underline text-sm mt-2"
                  onClick={() => {
                    initializeAddressFields();
                    setShowEditAddress(true);
                  }}
                >
                  Edit Address
                </button>
              </>
            );
          })()}
        </div>

        {/* Ship To */}
        <div className="flex-1 bg-gray-50 p-4 border border-gray-200 rounded-md">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Ship To
            {customer && (
              <button
                type="button"
                className="ml-2 text-xs border border-blue-500 text-blue-600 rounded px-2 py-1 bg-white hover:bg-blue-50 transition"
                onClick={copyBillToToShipTo}
              >
                Copy from Bill To
              </button>
            )}
          </h3>
          <input
            type="text"
            name="ship_to_name"
            value={form.ship_to_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="Name"
          />
          <input
            type="text"
            name="ship_to_address"
            value={form.ship_to_address || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="Address"
          />
          <input
            type="text"
            name="ship_to_city"
            value={form.ship_to_city || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="City"
          />
          <input
            type="text"
            name="ship_to_state"
            value={form.ship_to_state || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="State"
          />
          <input
            type="text"
            name="ship_to_zip"
            value={form.ship_to_zip || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="ZIP Code"
          />
          <input
            type="text"
            name="ship_to_country"
            value={form.ship_to_country || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="Country"
          />
          <input
            type="text"
            name="ship_to_gstin"
            value={form.ship_to_gstin || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-md bg-transparent text-base focus:border-blue-500 mb-1"
            placeholder="GSTIN"
          />
        </div>
      </div>
    </div>
  );
};

export default BillToShipTo; 