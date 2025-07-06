'use client'
import React, { useState } from "react";

interface CustomerRegistrationFormProps {
  initialValues?: any;
  onSubmit?: (fields: any) => Promise<void>;
  isEdit?: boolean;
}

const salutationOptions = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];
const paymentTermsOptions = [
  "Due on Receipt",
  "Net 7",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
];
const portalLanguages = ["English", "Hindi", "French", "German"];
const currencyOptions = ["INR - Indian Rupee", "USD - US Dollar", "EUR - Euro"];

const tabList = [
  "Other Details",
  "Address",
  "Contact Persons",
  "Custom Fields",
  "Remarks",
];

const countryOptions = ["India", "United States", "United Kingdom", "Canada", "Australia"];
const stateOptions = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Other"];

const CustomerRegistrationForm: React.FC<CustomerRegistrationFormProps> = ({ initialValues = {}, onSubmit, isEdit = false }) => {
  const [customerType, setCustomerType] = useState(initialValues.customer_type || "Business");
  const [salutation, setSalutation] = useState(initialValues.salutation || "");
  const [firstName, setFirstName] = useState(initialValues.first_name || "");
  const [lastName, setLastName] = useState(initialValues.last_name || "");
  const [companyName, setCompanyName] = useState(initialValues.company_name || "");
  const [displayName, setDisplayName] = useState(initialValues.display_name || "");
  const [currency, setCurrency] = useState(initialValues.currency || currencyOptions[0]);
  const [email, setEmail] = useState(initialValues.email || "");
  const [workPhone, setWorkPhone] = useState(initialValues.work_phone || "");
  const [mobile, setMobile] = useState(initialValues.mobile || "");
  const [tab, setTab] = useState(tabList[0]);
  // Other Details
  const [pan, setPan] = useState(initialValues.pan || "");
  const [paymentTerms, setPaymentTerms] = useState(initialValues.payment_terms || paymentTermsOptions[0]);
  const [enablePortal, setEnablePortal] = useState(initialValues.allowLogin || false);
  const [portalLanguage, setPortalLanguage] = useState(initialValues.portal_language || portalLanguages[0]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Address, Contact Persons, Custom Fields, Remarks can be expanded as needed
  // Billing Address
  const [billingAttention, setBillingAttention] = useState(initialValues.billing_attention || "");
  const [billingCountry, setBillingCountry] = useState(initialValues.billing_country || "");
  const [billingAddress1, setBillingAddress1] = useState(initialValues.billing_address1 || "");
  const [billingAddress2, setBillingAddress2] = useState(initialValues.billing_address2 || "");
  const [billingCity, setBillingCity] = useState(initialValues.billing_city || "");
  const [billingState, setBillingState] = useState(initialValues.billing_state || "");
  const [billingPin, setBillingPin] = useState(initialValues.billing_pin || "");
  const [billingPhone, setBillingPhone] = useState(initialValues.billing_phone || "");
  const [billingFax, setBillingFax] = useState(initialValues.billing_fax || "");
  // Shipping Address
  const [shippingAttention, setShippingAttention] = useState(initialValues.shipping_attention || "");
  const [shippingCountry, setShippingCountry] = useState(initialValues.shipping_country || "");
  const [shippingAddress1, setShippingAddress1] = useState(initialValues.shipping_address1 || "");
  const [shippingAddress2, setShippingAddress2] = useState(initialValues.shipping_address2 || "");
  const [shippingCity, setShippingCity] = useState(initialValues.shipping_city || "");
  const [shippingState, setShippingState] = useState(initialValues.shipping_state || "");
  const [shippingPin, setShippingPin] = useState(initialValues.shipping_pin || "");
  const [shippingPhone, setShippingPhone] = useState(initialValues.shipping_phone || "");
  const [shippingFax, setShippingFax] = useState(initialValues.shipping_fax || "");
  // Other Details
  const [website, setWebsite] = useState(initialValues.website || "");
  const [department, setDepartment] = useState(initialValues.department || "");
  const [designation, setDesignation] = useState(initialValues.designation || "");
  const [twitter, setTwitter] = useState(initialValues.twitter || "");
  const [skype, setSkype] = useState(initialValues.skype || "");
  const [facebook, setFacebook] = useState(initialValues.facebook || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3);
      setDocuments(filesArray);
    }
  };

  const handleCopyBillingToShipping = () => {
    setShippingAttention(billingAttention);
    setShippingCountry(billingCountry);
    setShippingAddress1(billingAddress1);
    setShippingAddress2(billingAddress2);
    setShippingCity(billingCity);
    setShippingState(billingState);
    setShippingPin(billingPin);
    setShippingPhone(billingPhone);
    setShippingFax(billingFax);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const fields = {
      name: displayName || companyName,
      email,
      allowLogin: enablePortal,
      customer_type: customerType,
      salutation,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      display_name: displayName,
      currency,
      work_phone: workPhone,
      mobile,
      pan,
      payment_terms: paymentTerms,
      portal_language: portalLanguage,
      billing_attention: billingAttention,
      billing_country: billingCountry,
      billing_address1: billingAddress1,
      billing_address2: billingAddress2,
      billing_city: billingCity,
      billing_state: billingState,
      billing_pin: billingPin,
      billing_phone: billingPhone,
      billing_fax: billingFax,
      shipping_attention: shippingAttention,
      shipping_country: shippingCountry,
      shipping_address1: shippingAddress1,
      shipping_address2: shippingAddress2,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_pin: shippingPin,
      shipping_phone: shippingPhone,
      shipping_fax: shippingFax,
      website,
      department,
      designation,
      twitter,
      skype,
      facebook
    };
    try {
      if (onSubmit) {
        await onSubmit(fields);
        setSuccess(true);
      } else {
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to create customer");
        } else {
          setSuccess(true);
          // Optionally reset form fields here
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">{isEdit ? "Edit Customer" : "New Customer"}</h2>
      {/* Customer Type */}
      <div className="mb-4 flex items-center gap-6">
        <label className="font-medium">Customer Type:</label>
        <label className="flex items-center gap-1">
          <input type="radio" name="customerType" value="Business" checked={customerType === "Business"} onChange={() => setCustomerType("Business")} /> Business
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="customerType" value="Individual" checked={customerType === "Individual"} onChange={() => setCustomerType("Individual")} /> Individual
        </label>
      </div>
      {/* Primary Contact */}
      <div className="mb-4 flex gap-2">
        <select className="border rounded px-2 py-1" value={salutation} onChange={e => setSalutation(e.target.value)}>
          <option value="">Salutation</option>
          {salutationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <input className="border rounded px-2 py-1 flex-1" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input className="border rounded px-2 py-1 flex-1" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
      {/* Company Name */}
      <div className="mb-4">
        <input className="border rounded px-2 py-1 w-full" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
      </div>
      {/* Display Name */}
      <div className="mb-4">
        <input className="border rounded px-2 py-1 w-full" placeholder="Display Name*" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
      </div>
      {/* Currency */}
      <div className="mb-4">
        <select className="border rounded px-2 py-1 w-full" value={currency} onChange={e => setCurrency(e.target.value)}>
          {currencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <p className="text-xs text-gray-500 mt-1">Currency cannot be edited as multi-currency handling is unavailable.</p>
      </div>
      {/* Email Address */}
      <div className="mb-4">
        <input type="email" className="border rounded px-2 py-1 w-full" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      {/* Phone */}
      <div className="mb-4 flex gap-2">
        <input className="border rounded px-2 py-1 flex-1" placeholder="Work Phone" value={workPhone} onChange={e => setWorkPhone(e.target.value)} />
        <input className="border rounded px-2 py-1 flex-1" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
      </div>
      {/* Tabs */}
      <div className="mb-4 border-b flex gap-6">
        {tabList.map(t => (
          <button type="button" key={t} className={`pb-2 ${tab === t ? 'border-b-2 border-blue-600 font-semibold' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === "Other Details" && (
        <div className="mb-4 space-y-4">
          <input className="border rounded px-2 py-1 w-full" placeholder="PAN" value={pan} onChange={e => setPan(e.target.value)} />
          <div>
            <label className="block mb-1">Payment Terms</label>
            <select className="border rounded px-2 py-1 w-full" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
              {paymentTermsOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={enablePortal} onChange={e => setEnablePortal(e.target.checked)} id="enablePortal" />
            <label htmlFor="enablePortal">Allow portal access for this customer</label>
          </div>
          <div>
            <label className="block mb-1">Portal Language</label>
            <select className="border rounded px-2 py-1 w-full" value={portalLanguage} onChange={e => setPortalLanguage(e.target.value)}>
              {portalLanguages.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Documents</label>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="block" />
            <p className="text-xs text-gray-500">You can upload a maximum of 3 files, 10MB each</p>
            <ul className="text-xs mt-1">
              {documents.map((file, idx) => <li key={idx}>{file.name}</li>)}
            </ul>
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">🌐</span>
            <input className="border rounded px-8 py-1 w-full" placeholder="Website URL" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>
          <input className="border rounded px-2 py-1 w-full" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
          <input className="border rounded px-2 py-1 w-full" placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} />
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-black font-bold text-lg">X</span>
            <input className="border rounded px-8 py-1 w-full" placeholder="Twitter/X" value={twitter} onChange={e => setTwitter(e.target.value)} />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-400">💬</span>
            <input className="border rounded px-8 py-1 w-full" placeholder="Skype Name/Number" value={skype} onChange={e => setSkype(e.target.value)} />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#1877F2"/>
                <path d="M21.5 16.5H18.5V26H14.5V16.5H12.5V13.5H14.5V11.75C14.5 9.67893 15.6789 8 18.25 8H21.5V11H19.75C19.1977 11 18.5 11.1977 18.5 12V13.5H21.5L21 16.5Z" fill="white"/>
              </svg>
            </span>
            <input className="border rounded px-8 py-1 w-full" placeholder="Facebook" value={facebook} onChange={e => setFacebook(e.target.value)} />
          </div>
        </div>
      )}
      {tab === "Address" && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Billing Address */}
          <div>
            <h4 className="font-semibold mb-2">Billing Address</h4>
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Attention" value={billingAttention} onChange={e => setBillingAttention(e.target.value)} />
            <select className="border rounded px-2 py-1 w-full mb-2" value={billingCountry} onChange={e => setBillingCountry(e.target.value)}>
              <option value="">Country/Region</option>
              {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <textarea className="border rounded px-2 py-1 w-full mb-2" placeholder="Street 1" value={billingAddress1} onChange={e => setBillingAddress1(e.target.value)} />
            <textarea className="border rounded px-2 py-1 w-full mb-2" placeholder="Street 2" value={billingAddress2} onChange={e => setBillingAddress2(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="City" value={billingCity} onChange={e => setBillingCity(e.target.value)} />
            <select className="border rounded px-2 py-1 w-full mb-2" value={billingState} onChange={e => setBillingState(e.target.value)}>
              <option value="">State</option>
              {stateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Pin Code" value={billingPin} onChange={e => setBillingPin(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Phone" value={billingPhone} onChange={e => setBillingPhone(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Fax Number" value={billingFax} onChange={e => setBillingFax(e.target.value)} />
          </div>
          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">Shipping Address <button type="button" className="text-blue-600 text-xs underline ml-2" onClick={handleCopyBillingToShipping}>(Copy billing address)</button></h4>
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Attention" value={shippingAttention} onChange={e => setShippingAttention(e.target.value)} />
            <select className="border rounded px-2 py-1 w-full mb-2" value={shippingCountry} onChange={e => setShippingCountry(e.target.value)}>
              <option value="">Country/Region</option>
              {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <textarea className="border rounded px-2 py-1 w-full mb-2" placeholder="Street 1" value={shippingAddress1} onChange={e => setShippingAddress1(e.target.value)} />
            <textarea className="border rounded px-2 py-1 w-full mb-2" placeholder="Street 2" value={shippingAddress2} onChange={e => setShippingAddress2(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="City" value={shippingCity} onChange={e => setShippingCity(e.target.value)} />
            <select className="border rounded px-2 py-1 w-full mb-2" value={shippingState} onChange={e => setShippingState(e.target.value)}>
              <option value="">State</option>
              {stateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Pin Code" value={shippingPin} onChange={e => setShippingPin(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Phone" value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} />
            <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Fax Number" value={shippingFax} onChange={e => setShippingFax(e.target.value)} />
          </div>
        </div>
      )}
      {tab === "Contact Persons" && (
        <div className="mb-4 text-gray-500">Contact persons fields go here...</div>
      )}
      {tab === "Custom Fields" && (
        <div className="mb-4 text-gray-500">Custom fields go here...</div>
      )}
      {tab === "Remarks" && (
        <div className="mb-4 text-gray-500">Remarks fields go here...</div>
      )}
      {/* Save/Cancel */}
      <div className="flex gap-2 mt-6">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? (isEdit ? "Saving..." : "Saving...") : (isEdit ? "Save Changes" : "Save")}
        </button>
        <button type="button" className="border px-6 py-2 rounded" onClick={() => window.history.back()} disabled={loading}>Cancel</button>
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {success && <div className="text-green-600 mt-4">{isEdit ? "Customer updated successfully!" : "Customer created successfully!"}</div>}
    </form>
  );
};

export default CustomerRegistrationForm; 