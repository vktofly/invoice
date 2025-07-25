'use client';

import React, { useState } from 'react';

type Address = {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type AddAddressModalProps = {
  customerId: string;
  onClose: () => void;
  onAddressAdded: (newAddress: any) => void;
};

const AddAddressModal: React.FC<AddAddressModalProps> = ({ customerId, onClose, onAddressAdded }) => {
  const [newAddress, setNewAddress] = useState<Address>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = async () => {
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
      onAddressAdded(savedAddress.address);
      onClose();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save address');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
        <div className="space-y-3">
          <input className="input w-full" placeholder="Address Line 1" name="address_line1" value={newAddress.address_line1} onChange={handleManualAddressChange} />
          <input className="input w-full" placeholder="Address Line 2 (Optional)" name="address_line2" value={newAddress.address_line2} onChange={handleManualAddressChange} />
          <input className="input w-full" placeholder="City" name="city" value={newAddress.city} onChange={handleManualAddressChange} />
          <input className="input w-full" placeholder="State" name="state" value={newAddress.state} onChange={handleManualAddressChange} />
          <input className="input w-full" placeholder="ZIP Code" name="postal_code" value={newAddress.postal_code} onChange={handleManualAddressChange} />
          <input className="input w-full" placeholder="Country" name="country" value={newAddress.country} onChange={handleManualAddressChange} />
        </div>
        {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button onClick={saveNewAddress} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
