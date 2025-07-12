'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toWords } from 'number-to-words';
import AddCustomerModal from '@/components/invoice/AddCustomerModal';
import AddAddressModal from '@/components/invoice/AddAddressModal';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import FormErrors from '@/components/FormErrors';
import { supabase } from '@/lib/supabase/client';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InvoicePDF from '@/app/(protected)/invoices/[id]/InvoicePDF';

import { Invoice, InvoiceItem, Customer, CustomerAddress } from '@/lib/types';

// Schemas
const ItemSchema = z.object({
  description: z.string().nonempty('Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit_price: z.number().nonnegative('Price cannot be negative'),
  tax_rate: z.number().min(0).max(100, 'Tax rate must be between 0-100'),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_amount: z.number().nonnegative('Discount cannot be negative').optional(),
});

const AddressSchema = z.object({
  id: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  is_default_billing: z.boolean().optional(),
  is_default_shipping: z.boolean().optional(),
  created_at: z.string().optional(),
});

const InvoiceSchema = z.object({
  number: z.string(),
  customer_id: z.string().nonempty('Customer is required'),
  issue_date: z.string(),
  due_date: z.string(),
  items: z.array(ItemSchema).min(1, 'Invoice must have at least one item'),
  notes: z.string().optional(),
  logo_url: z.string().url().or(z.literal('')).optional(),
  color_theme: z.string().optional(),
  user_company_name: z.string().optional(),
  user_address: z.string().optional(),
  user_contact: z.string().optional(),
  currency: z.string().optional(),
  authorized_signature: z.string().optional(),
  billing_address_id: z.string().nullable().optional(),
  shipping_address_id: z.string().nullable().optional(),
  billing_address: AddressSchema.nullable().optional(),
  shipping_address: AddressSchema.nullable().optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_amount: z.number().nonnegative('Discount cannot be negative').optional(),
  shipping_method: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_cost: z.number().nonnegative('Shipping cost cannot be negative').optional(),
  custom_fields: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  is_recurring: z.boolean().optional(),
  recurring_frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  recurring_start_date: z.string().optional(),
  recurring_end_date: z.string().optional().nullable(),
});

type FormState = z.infer<typeof InvoiceSchema>;

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return symbols[currency] || '$';
};

// Default initial state for the form
const defaultInitialState: FormState = {
  number: '',
  customer_id: '',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_amount: 0 }],
  notes: 'Thank you for your business!',
  logo_url: '',
  color_theme: '#4f46e5',
  user_company_name: '',
  user_address: '',
  user_contact: '',
  currency: 'INR',
  authorized_signature: '',
  billing_address_id: '',
  shipping_address_id: '',
  billing_address: null,
  shipping_address: null,
  discount_type: 'fixed',
  discount_amount: 0,
  shipping_method: '',
  tracking_number: '',
  shipping_cost: 0,
  custom_fields: [],
  is_recurring: false,
  recurring_frequency: 'monthly',
  recurring_start_date: new Date().toISOString().split('T')[0],
  recurring_end_date: null,
};

// Map DB invoice to form state (guard for missing fields)
const mapInvoiceToFormState = (invoice: any): FormState => {
  return {
    ...defaultInitialState,
    ...invoice,
    items: invoice.invoice_items?.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      discount_type: item.discount_type,
      discount_amount: item.discount_amount,
    })) || invoice.items || defaultInitialState.items,
    billing_address: invoice.billing_address || null,
    shipping_address: invoice.shipping_address || null,
    custom_fields: Array.isArray(invoice.custom_fields) ? invoice.custom_fields : [],
    recurring_start_date: invoice.recurring_start_date ? new Date(invoice.recurring_start_date).toISOString().split('T')[0] : defaultInitialState.recurring_start_date,
    recurring_end_date: invoice.recurring_end_date ? new Date(invoice.recurring_end_date).toISOString().split('T')[0] : null,
  };
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};

export default function InvoiceForm({ initialInvoice }: { initialInvoice?: Invoice | null }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { user } = useAuth();
  const { currentOrg } = useOrganizationContext();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressType, setAddressType] = useState<'billing' | 'shipping' | null>(null);
  const [isCustomDueDate, setIsCustomDueDate] = useState(false);
  const [billingAddresses, setBillingAddresses] = useState<any[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  const [formState, setFormState] = useState<FormState>(
    initialInvoice ? mapInvoiceToFormState(initialInvoice) : defaultInitialState
  );
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const isEditMode = !!initialInvoice;

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data.customers || []);
  };

  const fetchAddresses = async (customerId: string) => {
    if (!customerId) {
      setBillingAddresses([]);
      setShippingAddresses([]);
      return;
    }
    const res = await fetch(`/api/customers/${customerId}/addresses`);
    const data = await res.json();
    const addresses = data.addresses || [];
    setBillingAddresses(addresses);
    setShippingAddresses(addresses);
  };

  const fetchOutstandingBalance = async (customerId: string) => {
    if (!customerId) {
      setOutstandingBalance(0);
      return;
    }
    try {
      const res = await fetch(`/api/customers/${customerId}/outstanding-balance`);
      if (!res.ok) throw new Error('Failed to fetch outstanding balance');
      const data = await res.json();
      setOutstandingBalance(data.outstanding_balance || 0);
    } catch (error) {
      console.error(error);
      setOutstandingBalance(0); // Reset on error
    }
  };

  const fetchNextInvoiceNumber = async () => {
    const res = await fetch('/api/invoices/next-number');
    const data = await res.json();
    setFormState(prev => ({ ...prev, number: data.number }));
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/invoice-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchTemplates();
    if (!isEditMode) {
      fetchNextInvoiceNumber();
    }
  }, [isEditMode]);

  useEffect(() => {
    // If in create mode, populate from org and user context
    if (!isEditMode) {
      if (currentOrg) {
        setFormState(prev => ({
          ...prev,
          user_company_name: currentOrg.name || '',
          user_address: currentOrg.address || '',
          currency: currentOrg.currency || 'USD',
        }));
      }
      if (user) {
        setFormState(prev => ({
          ...prev,
          user_contact: user.email || '',
        }));
      }
    }
  }, [currentOrg, user, isEditMode]);

  useEffect(() => {
    // If customer is already set (in edit mode), fetch their addresses
    if (formState.customer_id) {
      fetchAddresses(formState.customer_id);
      fetchOutstandingBalance(formState.customer_id);
    }
  }, [formState.customer_id]);


  const handleAddCustomer = (newCustomer: any) => {
    setCustomers(prev => [...prev, newCustomer]);
    setFormState(prev => ({ ...prev, customer_id: newCustomer.id }));
    setIsModalOpen(false);
    fetchAddresses(newCustomer.id);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setFormState(prev => ({ 
      ...prev, 
      customer_id: customerId,
      billing_address_id: '',
      shipping_address_id: '',
      billing_address: null,
      shipping_address: null,
    }));
    fetchAddresses(customerId);
    fetchOutstandingBalance(customerId);
  };

  const handleAddressChange = (type: 'billing' | 'shipping', addressId: string) => {
    if (addressId === 'add_new') {
      setAddressType(type);
      setIsAddressModalOpen(true);
      return;
    }
    
    const addresses = billingAddresses; // Both lists are the same now
    const address = addresses.find(a => a.id === addressId);
    
    setFormState(prev => ({
      ...prev,
      [`${type}_address_id`]: addressId,
      [`${type}_address`]: address || null,
    }));
  };

  const handleAddressAdded = (newAddress: any) => {
    if (addressType) {
      // Add to both billing and shipping address lists
      setBillingAddresses(prev => [...prev, newAddress]);
      setShippingAddresses(prev => [...prev, newAddress]);
      
      handleAddressChange(addressType, newAddress.id);
    }
    setIsAddressModalOpen(false);
    setAddressType(null);
  };

  const copyBillingToShipping = () => {
    if (formState.billing_address_id) {
      const billingAddress = billingAddresses.find(a => a.id === formState.billing_address_id);
      if (billingAddress) {
        setFormState(prev => ({
          ...prev,
          shipping_address_id: formState.billing_address_id,
          shipping_address: billingAddress,
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof z.infer<typeof ItemSchema>, value: any) => {
    const newItems = [...formState.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormState(prev => ({ ...prev, items: newItems }));
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newCustomFields = [...(formState.custom_fields || [])];
    newCustomFields[index] = { ...newCustomFields[index], [field]: value };
    setFormState(prev => ({ ...prev, custom_fields: newCustomFields }));
  };

  const addCustomField = () => {
    setFormState(prev => ({
      ...prev,
      custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }],
    }));
  };

  const removeCustomField = (index: number) => {
    setFormState(prev => ({
      ...prev,
      custom_fields: (prev.custom_fields || []).filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setFormState(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_amount: 0 }] }));
  };

  const removeItem = (index: number) => {
    setFormState(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (status: 'draft' | 'sent') => {
    setActiveAction(status);
    const result = InvoiceSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setActiveAction(null);
      return;
    }

    if (formState.is_recurring) {
      // Handle recurring invoice creation
      try {
        const res = await fetch('/api/recurring-invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
          console.error('Server responded with an error:', errorData);
          throw new Error(`Server Error: ${errorData.error || res.statusText}`);
        }

        router.push('/recurring-invoices'); // Redirect to recurring invoices list
      } catch (error: any) {
        console.error(error);
        setErrors({ form: [error.message] });
      } finally {
        setActiveAction(null);
      }
      return; // Stop further execution
    }

    // Handle regular invoice creation/update
    const url = isEditMode ? `/api/invoices/${initialInvoice?.id}` : '/api/invoices';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, status }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        console.error('Server responded with an error:', errorData);
        throw new Error(`Server Error: ${errorData.error || res.statusText}`);
      }

      const { id } = await res.json();

      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadPromises = attachments.map(async (file) => {
          const filePath = `${user!.id}/${id}/${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('invoice-attachments')
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          return { name: file.name, path: filePath, size: file.size, type: file.type };
        });

        const uploadedAttachments = await Promise.all(uploadPromises);

        // Associate attachments with the invoice
        await fetch(`/api/invoices/${id}/attachments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attachments: uploadedAttachments }),
        });
      }

      router.push(`/invoices/${id}`);
    } catch (error: any) {
      console.error(error);
      setErrors({ form: [error.message] });
    } finally {
      setActiveAction(null);
    }
  };

  const onSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit('draft');
  };

  const onSaveAndSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit('sent');
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const customer = customers.find(c => c.id === formState.customer_id);

    const invoiceDataForPdf = {
      ...formState,
      invoice_items: formState.items.map(item => ({
        ...item,
        line_total: item.quantity * item.unit_price
      })),
      customers: customer || { name: 'N/A', email: '' },
      billing_address: formState.billing_address || { address_line1: '', city: '', state: '', postal_code: '' },
      shipping_address: formState.shipping_address || { address_line1: '', city: '', state: '', postal_code: '' },
      subtotal: subtotal,
      tax_amount: totalTax,
      total_amount: total,
    };

    const blob = await pdf(<InvoicePDF invoice={invoiceDataForPdf} />).toBlob();
    saveAs(blob, `Invoice-${formState.number}.pdf`);
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!templateId) {
      // Reset to default if "Select a Template" is chosen
      setFormState(defaultInitialState);
      fetchNextInvoiceNumber(); // Refetch the next invoice number
      return;
    }

    try {
      const res = await fetch(`/api/invoice-templates/${templateId}`);
      if (res.ok) {
        const { template_data } = await res.json();
        // Preserve the invoice number, but apply the rest of the template
        setFormState(prev => ({
          ...mapInvoiceToFormState(template_data),
          number: prev.number, 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch template data:', error);
    }
  };

  const handleSaveAsTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveAction('template');

    const templateName = prompt('Please enter a name for your template:');
    if (!templateName) {
      setActiveAction(null);
      return;
    }

    const result = InvoiceSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setActiveAction(null);
      return;
    }

    try {
      const res = await fetch('/api/invoice-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_name: templateName, template_data: result.data }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        console.error('Server responded with an error:', errorData);
        throw new Error(`Server Error: ${errorData.error || res.statusText}`);
      }

      alert('Template saved successfully!');
    } catch (error: any) {
      console.error(error);
      setErrors({ form: [error.message] });
    } finally {
      setActiveAction(null);
    }
  };

  const subtotal = formState.items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.unit_price;
    let discount = 0;
    if (item.discount_type === 'percentage') {
      discount = itemTotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      discount = item.discount_amount || 0;
    }
    return acc + itemTotal - discount;
  }, 0);

  const totalTax = formState.items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.unit_price;
    let discount = 0;
    if (item.discount_type === 'percentage') {
      discount = itemTotal * ((item.discount_amount || 0) / 100);
    } else if (item.discount_type === 'fixed') {
      discount = item.discount_amount || 0;
    }
    const taxableAmount = itemTotal - discount;
    return acc + (taxableAmount * (item.tax_rate / 100));
  }, 0);

  const preDiscountTotal = subtotal + totalTax + (formState.shipping_cost || 0);
  
  let overallDiscount = 0;
  if (formState.discount_type === 'percentage') {
    overallDiscount = preDiscountTotal * ((formState.discount_amount || 0) / 100);
  } else if (formState.discount_type === 'fixed') {
    overallDiscount = formState.discount_amount || 0;
  }

  const total = preDiscountTotal - overallDiscount;
  const balanceDue = total + outstandingBalance;
  const currencySymbol = getCurrencySymbol(formState.currency || 'USD');

  const editorPanel = (
    <div className="space-y-6">
      <FormErrors errors={errors} />

      {/* Card 1: Core Details */}
      <div className="p-6 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg space-y-6">
        <div className="flex justify-between items-center mb-2 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
            <h2 className="text-xl font-semibold">Core Details</h2>
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Information</h3>
          <div className="space-y-4">
            <input type="text" name="user_company_name" placeholder="Your Company Name" value={formState.user_company_name} onChange={handleInputChange} className="input" />
            <input type="text" name="user_address" placeholder="Your Address, City, ZIP" value={formState.user_address} onChange={handleInputChange} className="input" />
            <input type="text" name="user_contact" placeholder="Your Email or Phone" value={formState.user_contact} onChange={handleInputChange} className="input" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h3>
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
              <h3 className="text-md font-semibold mb-4 text-gray-800">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="shipping_method" className="block text-sm font-medium text-gray-600 mb-1">Method</label>
                    <input id="shipping_method" type="text" name="shipping_method" placeholder="e.g. Courier" value={formState.shipping_method} onChange={handleInputChange} className="input" />
                </div>
                <div>
                    <label htmlFor="tracking_number" className="block text-sm font-medium text-gray-600 mb-1">Tracking #</label>
                    <input id="tracking_number" type="text" name="tracking_number" placeholder="Tracking Number" value={formState.tracking_number} onChange={handleInputChange} className="input" />
                </div>
                <div>
                    <label htmlFor="shipping_cost" className="block text-sm font-medium text-gray-600 mb-1">Cost</label>
                    <input id="shipping_cost" type="number" name="shipping_cost" value={formState.shipping_cost} onChange={e => setFormState(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) || 0 }))} className="input" />
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
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
              <input 
                id="due_date"
                type="date" 
                name="due_date" 
                value={formState.due_date} 
                onChange={handleInputChange} 
                className={`input w-full ${!isCustomDueDate && 'bg-gray-200'}`}
                readOnly={!isCustomDueDate}
              />
            </div>
          </div>
      </div>

      {/* Card 2: Invoice Line Items */}
      <div className="p-6 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-4 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
          <h2 className="text-xl font-semibold">Invoice Items</h2>
          <span className="text-sm">{formState.items.length} item(s)</span>
        </div>
        <div className="overflow-x-auto">
            <div className="hidden lg:grid grid-cols-12 gap-2 mb-2 items-center px-1 text-sm font-semibold text-gray-800 min-w-[700px]">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Rate</div>
                <div className="col-span-1">Tax(%)</div>
                <div className="col-span-3">Discount</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1"></div>
            </div>
            <div className="lg:hidden grid grid-cols-12 gap-2 mb-2 items-center px-1 text-sm font-semibold text-gray-800 min-w-[600px]">
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Rate</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1"></div>
            </div>
            {formState.items.map((item, index) => {
                const itemSubtotal = item.quantity * item.unit_price;
                let itemDiscount = 0;
                if (item.discount_type === 'percentage') {
                    itemDiscount = itemSubtotal * ((item.discount_amount || 0) / 100);
                } else if (item.discount_type === 'fixed') {
                    itemDiscount = item.discount_amount || 0;
                }
                const itemTax = (itemSubtotal - itemDiscount) * (item.tax_rate / 100);
                const itemTotal = itemSubtotal - itemDiscount + itemTax;

                return (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center min-w-[700px]">
                        <span className="col-span-1 text-center">{index + 1}</span>
                        <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="input col-span-3" />
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="input col-span-1" />
                        <input type="number" placeholder="Rate" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} className="input col-span-1" />
                        <input type="number" placeholder="Tax %" value={item.tax_rate} onChange={e => handleItemChange(index, 'tax_rate', parseFloat(e.target.value))} className="input col-span-1" />
                        <div className="col-span-3 grid grid-cols-2 gap-2">
                            <select
                                value={item.discount_type || 'fixed'}
                                onChange={e => handleItemChange(index, 'discount_type', e.target.value as 'fixed' | 'percentage')}
                                className="input text-xs p-1"
                            >
                                <option value="fixed">Fixed</option>
                                <option value="percentage">%</option>
                            </select>
                            <input type="number" placeholder="Discount" value={item.discount_amount || 0} onChange={e => handleItemChange(index, 'discount_amount', parseFloat(e.target.value) || 0)} className="input" />
                        </div>
                        <div className="col-span-1 input bg-gray-100 flex items-center justify-end">{currencySymbol}{itemTotal.toFixed(2)}</div>
                        <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 justify-self-center">X</button>
                    </div>
                );
            })}
        </div>
        <button onClick={addItem} className="btn-secondary mt-2"><PlusIcon className="h-4 w-4 mr-1" /> Add Item</button>
        <div className="mt-6 flex justify-end">
            <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Total Tax:</span>
                    <span>{currencySymbol}{totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>{currencySymbol}{(formState.shipping_cost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Overall Discount:</span>
                  <div className="flex items-center gap-2">
                    <select
                      name="discount_type"
                      value={formState.discount_type}
                      onChange={handleInputChange}
                      className="input text-xs p-1"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percent</option>
                    </select>
                    <input
                      type="number"
                      name="discount_amount"
                      value={formState.discount_amount}
                      onChange={handleInputChange}
                      className="input w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20">
                    <span>Invoice Total:</span>
                    <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Previous Balance:</span>
                    <span>{currencySymbol}{outstandingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t border-white/20" style={{ color: formState.color_theme }}>
                    <span>Balance Due:</span>
                    <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Card 3: Additional Information */}
      <div className="p-6 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-4 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
            <h2 className="text-xl font-semibold">Additional Information</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Custom Fields</h3>
            <div className="space-y-4">
              {(formState.custom_fields || []).map((field, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={field.key}
                    onChange={e => handleCustomFieldChange(index, 'key', e.target.value)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Field Value"
                    value={field.value}
                    onChange={e => handleCustomFieldChange(index, 'value', e.target.value)}
                    className="input md:col-span-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="text-red-500 hover:text-red-700 justify-self-start md:justify-self-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addCustomField}
              className="btn-secondary mt-4"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Custom Field
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recurring Invoice</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_recurring"
                id="is_recurring"
                checked={formState.is_recurring}
                onChange={e => setFormState(prev => ({ ...prev, is_recurring: e.target.checked }))}
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
              />
              <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-800">
                This is a recurring invoice
              </label>
            </div>
            {formState.is_recurring && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="recurring_frequency" className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
                  <select
                    id="recurring_frequency"
                    name="recurring_frequency"
                    value={formState.recurring_frequency}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="recurring_start_date" className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="recurring_start_date"
                    name="recurring_start_date"
                    value={formState.recurring_start_date}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="recurring_end_date" className="block text-sm font-medium text-gray-600 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    id="recurring_end_date"
                    name="recurring_end_date"
                    value={formState.recurring_end_date || ''}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Attachments</h3>
            <div className="flex items-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/50 file:text-indigo-500 hover:file:bg-white/60"
              />
            </div>
            {attachments.length > 0 && (
              <div className="mt-4">
                <ul className="divide-y divide-gray-200/50">
                  {attachments.map((file, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className="text-sm text-gray-800">{file.name}</span>
                      <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Notes & Customization</h3>
            <textarea name="notes" value={formState.notes} onChange={handleInputChange} className="input w-full" rows={3}></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type="text" name="logo_url" placeholder="Logo URL" value={formState.logo_url} onChange={handleInputChange} className="input" />
              <input type="color" name="color_theme" value={formState.color_theme} onChange={handleInputChange} className="input h-10" />
            </div>
            <div className="mt-4">
              <label htmlFor="authorized_signature" className="block text-sm font-medium text-gray-600 mb-1">Authorized Signature</label>
              <input type="text" id="authorized_signature" name="authorized_signature" value={formState.authorized_signature} onChange={handleInputChange} className="input w-full" placeholder="Enter name for signature" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const previewPanel = (
    <div className="lg:sticky top-8 h-full">
      <div className="p-8 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg text-gray-800">
        <div className="flex justify-between items-start pb-8 mb-8 border-b" style={{ borderColor: formState.color_theme }}>
          <div>
            {formState.logo_url && <Image src={formState.logo_url} alt="logo" width={48} height={48} className="mb-4 rounded-lg" />}
            <h2 className="text-2xl font-bold text-gray-800">{formState.user_company_name || 'Your Company'}</h2>
            <p className="text-gray-600 text-sm">{formState.user_address || 'Your Company Address'}</p>
            <p className="text-gray-600 text-sm">{formState.user_contact || 'your-email@example.com'}</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold" style={{ color: formState.color_theme }}>INVOICE</h1>
            <p className="text-gray-600 mt-1"># {formState.number}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold text-gray-800">Billed To:</p>
            {formState.billing_address ? (
              <div className="text-gray-600">
                <p>{formState.billing_address.address_line1}</p>
                {formState.billing_address.address_line2 && <p>{formState.billing_address.address_line2}</p>}
                <p>{formState.billing_address.city}, {formState.billing_address.state} {formState.billing_address.postal_code}</p>
                <p>{formState.billing_address.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">No billing address selected</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">Shipped To:</p>
            {formState.shipping_address ? (
              <div className="text-gray-600">
                <p>{formState.shipping_address.address_line1}</p>
                {formState.shipping_address.address_line2 && <p>{formState.shipping_address.address_line2}</p>}
                <p>{formState.shipping_address.city}, {formState.shipping_address.state} {formState.shipping_address.postal_code}</p>
                <p>{formState.shipping_address.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">No shipping address selected</p>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
                <p className="font-semibold text-gray-800">Invoice Date:</p>
                <p className="text-gray-600">{formState.issue_date}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-800">Due Date:</p>
                <p className="text-gray-600">{formState.due_date}</p>
            </div>
        </div>
        {formState.custom_fields && formState.custom_fields.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-8">
            {formState.custom_fields.map((field, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-800">{field.key}:</p>
                <p className="text-gray-600">{field.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="overflow-x-auto mt-8">
            <table className="w-full text-left min-w-[600px]">
            <thead style={{ backgroundColor: formState.color_theme }}>
                <tr>
                <th className="p-3 text-white rounded-tl-lg">Description</th>
                <th className="p-3 text-white">Qty</th>
                <th className="p-3 text-white">Price</th>
                <th className="p-3 text-white">Tax (%)</th>
                <th className="p-3 text-white">Discount</th>
                <th className="p-3 text-white text-right rounded-tr-lg">Total</th>
                </tr>
            </thead>
            <tbody>
                {formState.items.map((item, i) => (
                <tr key={i} className="border-b border-white/20">
                    <td className="p-3">{item.description || '-'}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                    <td className="p-3">{item.tax_rate.toFixed(2)}%</td>
                    <td className="p-3">{currencySymbol}{item.discount_amount?.toFixed(2) || '0.00'}</td>
                    <td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unit_price * (1 + item.tax_rate / 100)).toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                    <p>Subtotal:</p>
                    <p>{currencySymbol}{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                    <p>Tax:</p>
                    <p>{currencySymbol}{totalTax.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between text-gray-600">
                    <p>Shipping:</p>
                    <p>{currencySymbol}{(formState.shipping_cost || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                    <p>Discount:</p>
                    <p>-{currencySymbol}{overallDiscount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-white/20">
                    <p>Invoice Total:</p>
                    <p>{currencySymbol}{total.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Previous Balance:</span>
                    <span>{currencySymbol}{outstandingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl mt-4 pt-2 border-t border-white/20" style={{ color: formState.color_theme }}>
                    <p>Balance Due:</p>
                    <p>{currencySymbol}{balanceDue.toFixed(2)}</p>
                </div>
            </div>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p className="font-semibold text-gray-800">Total in words:</p>
          <p className="capitalize">{toWords(total)}</p>
        </div>
        {formState.notes && (
          <div className="mt-8">
            <p className="font-semibold text-gray-800">Notes:</p>
            <p className="text-gray-600">{formState.notes}</p>
          </div>
        )}
        {formState.authorized_signature && (
          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="font-semibold text-gray-800" style={{fontFamily: '"Dancing Script", cursive'}}>{formState.authorized_signature}</p>
            <p className="text-xs text-gray-500">Authorized Signature</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && <AddCustomerModal onAddCustomer={handleAddCustomer} onClose={() => setIsModalOpen(false)} />}
      {isAddressModalOpen && formState.customer_id && (
        <AddAddressModal
          customerId={formState.customer_id}
          onClose={() => setIsAddressModalOpen(false)}
          onAddressAdded={handleAddressAdded}
        />
      )}
      <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? `Editing invoice ${formState.number}` : 'Fill out the details below to create a new invoice.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-700">Invoice #</span>
              <p className="text-xl font-bold" style={{ color: formState.color_theme }}>{formState.number}</p>
            </div>
          </div>
          {!isEditMode && templates.length > 0 && (
            <div className="mt-4">
              <label htmlFor="template_select" className="block text-sm font-medium text-gray-700 mb-1">
                Start from a Template
              </label>
              <select
                id="template_select"
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="input w-full max-w-xs"
                defaultValue=""
              >
                <option value="">Select a Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.template_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isMobile ? (
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
              {['Editor', 'Preview'].map((category) => (
                <Tab key={category} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${selected ? 'bg-white shadow text-blue-700' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`}
                    >
                      {category}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>{editorPanel}</Tab.Panel>
              <Tab.Panel>{previewPanel}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">{editorPanel}</div>
            <div className="lg:col-span-1">{previewPanel}</div>
          </div>
        )}
      </div>
      <InvoiceActions
        activeAction={activeAction}
        onSaveDraft={onSaveDraft}
        onSaveAndSend={onSaveAndSend}
        onSaveAsTemplate={handleSaveAsTemplate}
        onDownload={handleDownload}
      />
    </>
  );
}
