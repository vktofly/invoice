'use client';

import React, { useState } from 'react';

// Define the expected shape of the customer data
interface CustomerData {
  customer_type: string;
  salutation: string;
  first_name: string;
  last_name: string;
  company_name: string;
  display_name: string;
  currency: string;
  email: string;
  work_phone: string;
  mobile: string;
  billing_attention: string;
  billing_country: string;
  billing_address1: string;
  billing_address2: string;
  billing_city: string;
  billing_state: string;
  billing_pin: string;
  billing_phone: string;
  billing_fax: string;
  shipping_attention: string;
  shipping_country: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pin: string;
  shipping_phone: string;
  shipping_fax: string;
}

interface AddCustomerModalProps {
  onAddCustomer: (customer: any) => void;
  onClose: () => void;
}

export default function AddCustomerModal({ onAddCustomer, onClose }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerData>({
    customer_type: "Business",
    salutation: "Mr.",
    first_name: "",
    last_name: "",
    company_name: "",
    display_name: "",
    currency: "INR",
    email: "",
    work_phone: "",
    mobile: "",
    billing_attention: "",
    billing_country: "",
    billing_address1: "",
    billing_address2: "",
    billing_city: "",
    billing_state: "",
    billing_pin: "",
    billing_phone: "",
    billing_fax: "",
    shipping_attention: "",
    shipping_country: "",
    shipping_address1: "",
    shipping_address2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pin: "",
    shipping_phone: "",
    shipping_fax: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update display name based on other fields
  React.useEffect(() => {
    let newDisplayName = "";
    if (formData.customer_type === 'Business') {
      newDisplayName = formData.company_name;
    } else {
      newDisplayName = `${formData.first_name} ${formData.last_name}`.trim();
    }
    // If the auto-generated name is empty, use the email as a fallback
    if (!newDisplayName && formData.email) {
      newDisplayName = formData.email;
    }
    if (newDisplayName !== formData.display_name) {
      setFormData(prev => ({ ...prev, display_name: newDisplayName }));
    }
  }, [formData.customer_type, formData.first_name, formData.last_name, formData.company_name, formData.email, formData.display_name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyBillingAddress = () => {
    setFormData((prev) => ({
      ...prev,
      shipping_attention: prev.billing_attention,
      shipping_country: prev.billing_country,
      shipping_address1: prev.billing_address1,
      shipping_address2: prev.billing_address2,
      shipping_city: prev.billing_city,
      shipping_state: prev.billing_state,
      shipping_pin: prev.billing_pin,
      shipping_phone: prev.billing_phone,
      shipping_fax: prev.billing_fax,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newCustomer = await res.json();
        onAddCustomer(newCustomer.customer); // Pass the new customer back to the parent
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create customer.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Type</label>
              <div className="mt-1 flex items-center space-x-4">
                <label><input type="radio" name="customer_type" value="Business" checked={formData.customer_type === "Business"} onChange={handleChange} className="mr-2" />Business</label>
                <label><input type="radio" name="customer_type" value="Individual" checked={formData.customer_type === "Individual"} onChange={handleChange} className="mr-2" />Individual</label>
              </div>
            </div>
          </div>
          {formData.customer_type === 'Individual' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="salutation" className="block text-sm font-medium text-gray-700">Primary Contact</label>
                <select id="salutation" name="salutation" value={formData.salutation} onChange={handleChange} className="input mt-1">
                  <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                </select>
              </div>
              <div className="self-end"><input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="input" required /></div>
              <div className="self-end"><input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="input" required /></div>
            </div>
          ) : (
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} className="input mt-1" required />
            </div>
          )}
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">Display Name*</label>
            <input type="text" id="display_name" name="display_name" value={formData.display_name} className="input mt-1 bg-gray-100" required readOnly />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input mt-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex space-x-4">
              <input type="text" name="work_phone" placeholder="Work Phone" value={formData.work_phone} onChange={handleChange} className="input" />
              <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Address</h3>
              <div><label className="label">Attention</label><input type="text" name="billing_attention" value={formData.billing_attention} onChange={handleChange} className="input" /></div>
              <div><label className="label">Country/Region</label><input type="text" name="billing_country" value={formData.billing_country} onChange={handleChange} className="input" /></div>
              <div><label className="label">Address</label><textarea name="billing_address1" value={formData.billing_address1} onChange={handleChange} rows={2} className="input"></textarea></div>
              <div><label className="label">City</label><input type="text" name="billing_city" value={formData.billing_city} onChange={handleChange} className="input" /></div>
            </div>
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Address <button type="button" onClick={handleCopyBillingAddress} className="text-sm text-indigo-600 hover:underline ml-2">(Copy billing)</button></h3>
              <div><label className="label">Attention</label><input type="text" name="shipping_attention" value={formData.shipping_attention} onChange={handleChange} className="input" /></div>
              <div><label className="label">Country/Region</label><input type="text" name="shipping_country" value={formData.shipping_country} onChange={handleChange} className="input" /></div>
              <div><label className="label">Address</label><textarea name="shipping_address1" value={formData.shipping_address1} onChange={handleChange} rows={2} className="input"></textarea></div>
              <div><label className="label">City</label><input type="text" name="shipping_city" value={formData.shipping_city} onChange={handleChange} className="input" /></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Customer"}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-right">{error}</p>}
        </form>
      </div>
    </div>
  );
}
