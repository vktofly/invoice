"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
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
  gstin: string;
  pan: string;
  payment_terms: string;
  website: string;
}

interface Props {
  customer?: Customer;
}

const CustomerRegistrationForm: React.FC<Props> = ({ customer }) => {
  const [activeTab, setActiveTab] = useState("other_details_tab");
  const [formData, setFormData] = useState({
    customer_type: customer?.customer_type || "Business",
    salutation: customer?.salutation || "Mr.",
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    company_name: customer?.company_name || "",
    display_name: customer?.display_name || "",
    currency: customer?.currency || "INR",
    email: customer?.email || "",
    work_phone: customer?.work_phone || "",
    mobile: customer?.mobile || "",
    billing_attention: customer?.billing_attention || "",
    billing_country: customer?.billing_country || "",
    billing_address1: customer?.billing_address1 || "",
    billing_address2: customer?.billing_address2 || "",
    billing_city: customer?.billing_city || "",
    billing_state: customer?.billing_state || "",
    billing_pin: customer?.billing_pin || "",
    billing_phone: customer?.billing_phone || "",
    billing_fax: customer?.billing_fax || "",
    shipping_attention: customer?.shipping_attention || "",
    shipping_country: customer?.shipping_country || "",
    shipping_address1: customer?.shipping_address1 || "",
    shipping_address2: customer?.shipping_address2 || "",
    shipping_city: customer?.shipping_city || "",
    shipping_state: customer?.shipping_state || "",
    shipping_pin: customer?.shipping_pin || "",
    shipping_phone: customer?.shipping_phone || "",
    shipping_fax: customer?.shipping_fax || "",
    gstin: customer?.gstin || "",
    pan: customer?.pan || "",
    payment_terms: customer?.payment_terms || "Due on Receipt",
    website: customer?.website || "",
  });

  

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditing = !!customer;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'customer_type') {
        if (value === 'Individual') {
          newFormData.company_name = '';
        } else {
          newFormData.first_name = '';
          newFormData.last_name = '';
        }
      }
      return newFormData;
    });
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
    setSameAsBilling(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email) {
      setError("Email is required.");
      setLoading(false);
      return;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/customers/${customer.id}` : "/api/customers";
      const method = isEditing ? "PATCH" : "POST";

      const { display_name, ...payload } = { ...formData };
      // Convert empty strings to null for potentially numeric fields
      for (const key in payload) {
        if (payload[key] === '') {
          const inputElement = document.querySelector(`[name="${key}"]`);
          if (inputElement && inputElement.getAttribute('type') === 'number') {
            payload[key] = null;
          }
        }
      }
      const numericFields = [
        'work_phone', 'mobile', 'billing_phone', 'billing_fax', 'billing_pin',
        'shipping_phone', 'shipping_fax', 'shipping_pin'
      ];
      numericFields.forEach(field => {
        if (payload[field] === '') {
          payload[field] = null;
        }
      });

      console.log("Submitting payload:", payload);

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/customer");
        router.refresh();
      } else {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          console.error("Failed to parse error response as JSON:", e);
          errorData = { message: `Failed to parse error response. Status: ${res.status}` };
        }
        const errorMsg =
          (errorData && (errorData.message || errorData.error)) ||
          `Failed to ${isEditing ? 'update' : 'create'} customer. (Status: ${res.status})`;
        setError(errorMsg);
        console.error("API Error:", errorData, "Status:", res.status, "StatusText:", res.statusText);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const OtherDetailsContent = () => (
    <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <select id="currency" name="currency" value={formData.currency} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option>INR</option>
          <option>USD</option>
        </select>
      </div>
      <div>
        <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">Payment Terms</label>
        <select id="payment_terms" name="payment_terms" value={formData.payment_terms} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option>Due on Receipt</option>
          <option>Net 15</option>
          <option>Net 30</option>
          <option>Net 60</option>
        </select>
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
        <input type="text" id="website" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">GSTIN</label>
        <input type="text" id="gstin" name="gstin" value={formData.gstin} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN</label>
        <input type="text" id="pan" name="pan" value={formData.pan} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>
    </div>
  </div>
  );

  const AddressContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
        <div className="space-y-4">
          <div><label htmlFor="billing_attention" className="block text-sm font-medium text-gray-700">Attention</label><input type="text" id="billing_attention" name="billing_attention" value={formData.billing_attention} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_country" className="block text-sm font-medium text-gray-700">Country/Region</label><input type="text" id="billing_country" name="billing_country" value={formData.billing_country} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_address1" className="block text-sm font-medium text-gray-700">Address</label><textarea id="billing_address1" name="billing_address1" value={formData.billing_address1} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea></div>
          <div><label htmlFor="billing_address2" className="block text-sm font-medium text-gray-700">Address Line 2</label><input type="text" id="billing_address2" name="billing_address2" value={formData.billing_address2} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_city" className="block text-sm font-medium text-gray-700">City</label><input type="text" id="billing_city" name="billing_city" value={formData.billing_city} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_state" className="block text-sm font-medium text-gray-700">State</label><input type="text" id="billing_state" name="billing_state" value={formData.billing_state} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_pin" className="block text-sm font-medium text-gray-700">Pin Code</label><input type="text" id="billing_pin" name="billing_pin" value={formData.billing_pin} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_phone" className="block text-sm font-medium text-gray-700">Phone</label><input type="text" id="billing_phone" name="billing_phone" value={formData.billing_phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="billing_fax" className="block text-sm font-medium text-gray-700">Fax Number</label><input type="text" id="billing_fax" name="billing_fax" value={formData.billing_fax} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address <button type="button" onClick={handleCopyBillingAddress} className="text-sm text-blue-600 hover:underline">(Copy billing address)</button></h3>
        <div className="space-y-4">
          <div><label htmlFor="shipping_attention" className="block text-sm font-medium text-gray-700">Attention</label><input type="text" id="shipping_attention" name="shipping_attention" value={formData.shipping_attention} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700">Country/Region</label><input type="text" id="shipping_country" name="shipping_country" value={formData.shipping_country} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_address1" className="block text-sm font-medium text-gray-700">Address</label><textarea id="shipping_address1" name="shipping_address1" value={formData.shipping_address1} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea></div>
          <div><label htmlFor="shipping_address2" className="block text-sm font-medium text-gray-700">Address Line 2</label><input type="text" id="shipping_address2" name="shipping_address2" value={formData.shipping_address2} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">City</label><input type="text" id="shipping_city" name="shipping_city" value={formData.shipping_city} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700">State</label><input type="text" id="shipping_state" name="shipping_state" value={formData.shipping_state} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_pin" className="block text-sm font-medium text-gray-700">Pin Code</label><input type="text" id="shipping_pin" name="shipping_pin" value={formData.shipping_pin} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-700">Phone</label><input type="text" id="shipping_phone" name="shipping_phone" value={formData.shipping_phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="shipping_fax" className="block text-sm font-medium text-gray-700">Fax Number</label><input type="text" id="shipping_fax" name="shipping_fax" value={formData.shipping_fax} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Customer' : 'New Customer'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
            Prefill Customer details from the GST portal using the Customer&apos;s GSTIN. <a href="#" className="font-semibold">Prefill</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Type</label>
              <div className="mt-1 flex items-center space-x-4">
                <label><input type="radio" name="customer_type" value="Business" checked={formData.customer_type === "Business"} onChange={handleChange} className="mr-2" />Business</label>
                <label><input type="radio" name="customer_type" value="Individual" checked={formData.customer_type === "Individual"} onChange={handleChange} className="mr-2" />Individual</label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="salutation" className="block text-sm font-medium text-gray-700">Primary Contact</label>
              <select id="salutation" name="salutation" value={formData.salutation} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Ms.</option>
              </select>
            </div>
            <div className="self-end"><input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" { ... (formData.customer_type === 'Individual' ? { required: true } : {}) } /></div>
            <div className="self-end"><input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" { ... (formData.customer_type === 'Individual' ? { required: true } : {}) } /></div>
          </div>
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" { ... (formData.customer_type === 'Business' ? { required: true } : {}) } />
          </div>
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">Display Name*</label>
            <input type="text" id="display_name" name="display_name" value={formData.display_name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required readOnly />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-.full border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex space-x-4">
              <input type="text" name="work_phone" placeholder="Work Phone" value={formData.work_phone} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200 mt-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab("other_details_tab")} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "other_details_tab" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Other Details
            </button>
            <button onClick={() => setActiveTab("address_tab")} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "address_tab" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Address
            </button>
            <button onClick={() => setActiveTab("contact_persons_tab")} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "contact_persons_tab" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Contact Persons
            </button>
            <button onClick={() => setActiveTab("custom_fields_tab")} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "custom_fields_tab" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Custom Fields
            </button>
            <button onClick={() => setActiveTab("remarks_tab")} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "remarks_tab" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Remarks
            </button>
          </nav>
        </div>

        {activeTab === "other_details_tab" && <OtherDetailsContent />}
        {activeTab === "address_tab" && <AddressContent />}
        {activeTab === "contact_persons_tab" && <div>Contact Persons Content (Not implemented yet)</div>}
        {activeTab === "custom_fields_tab" && <div>Custom Fields Content (Not implemented yet)</div>}
        {activeTab === "remarks_tab" && <div>Remarks Content (Not implemented yet)</div>}

        <div className="flex justify-start space-x-4 pt-6">
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
            {loading ? "Saving..." : (isEditing ? "Update" : "Save")}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerRegistrationForm;
