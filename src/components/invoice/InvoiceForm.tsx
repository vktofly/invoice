'use client';

'use client';
import { useState, useEffect, Fragment, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Tab } from '@headlessui/react';
import AddCustomerModal from '@/components/invoice/AddCustomerModal';
import AddAddressModal from '@/components/invoice/AddAddressModal';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import FormErrors from '@/components/FormErrors';
import { supabase } from '@/lib/supabase/client';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InvoicePDF from '@/components/invoice/InvoicePDF';

import { Invoice } from '@/lib/types';
import { InvoiceSchema, ItemSchema } from '@/lib/schemas';
import InvoiceFormHeader from './form/InvoiceFormHeader';
import CoreDetails from './form/CoreDetails';
import InvoiceItems from './form/InvoiceItems';
import AdditionalInfo from './form/AdditionalInfo';
import InvoiceTemplate from '@/components/invoice/InvoiceTemplate';

type FormState = z.infer<typeof InvoiceSchema>;

const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
  return symbols[currency] || '$';
};

const defaultInitialState: FormState = {
  number: '',
  customer_id: '',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_type: 'fixed', discount_amount: 0 }],
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

const mapInvoiceToFormState = (invoice: any): FormState => {
  let custom_fields = [];
  if (Array.isArray(invoice.custom_fields)) {
    custom_fields = invoice.custom_fields;
  } else if (typeof invoice.custom_fields === 'string') {
    try {
      custom_fields = JSON.parse(invoice.custom_fields);
      if (!Array.isArray(custom_fields)) custom_fields = [];
    } catch (e) {
      console.error('Failed to parse custom_fields in mapInvoiceToFormState:', e);
      custom_fields = [];
    }
  }

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
    custom_fields: custom_fields,
    recurring_start_date: invoice.recurring_start_date ? new Date(invoice.recurring_start_date).toISOString().split('T')[0] : defaultInitialState.recurring_start_date,
    recurring_end_date: invoice.recurring_end_date ? new Date(invoice.recurring_end_date).toISOString().split('T')[0] : null,
  };
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return isMobile;
};

export default function InvoiceForm({ initialInvoice, user, customers: initialCustomers, organization }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const isPersonalWorkspace = useMemo(() => {
    if (!organization || !user?.email) return false;
    return organization.name === `${user.email}'s Workspace`;
  }, [organization, user]);

  const [customers, setCustomers] = useState(initialCustomers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressType, setAddressType] = useState<'billing' | 'shipping' | null>(null);
  const [isCustomDueDate, setIsCustomDueDate] = useState(false);
  const [paymentTerm, setPaymentTerm] = useState<string>('30');
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

  const fetchAddresses = async (customerId: string) => {
    if (!customerId) {
      setBillingAddresses([]);
      setShippingAddresses([]);
      setFormState(prev => ({ ...prev, billing_address_id: '', shipping_address_id: '', billing_address: null, shipping_address: null }));
      return;
    }
    const res = await fetch(`/api/customers/${customerId}/addresses`);
    const data = await res.json();
    const addresses = data.addresses || [];
    setBillingAddresses(addresses);
    setShippingAddresses(addresses);

    if (addresses.length > 0) {
      const firstAddress = addresses[0];
      setFormState(prev => ({ ...prev, billing_address_id: firstAddress.id, billing_address: firstAddress, shipping_address_id: firstAddress.id, shipping_address: firstAddress }));
    }
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
      setOutstandingBalance(0);
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
    fetchTemplates();
    if (!isEditMode) {
      fetchNextInvoiceNumber();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      if (organization) {
        setFormState(prev => ({
          ...prev,
          user_company_name: organization.name || '',
          user_address: organization.address || '',
          currency: organization.currency || 'USD',
        }));
      }
      if (user) {
        setFormState(prev => ({
          ...prev,
          user_contact: user.user_metadata?.full_name || user.email || '',
        }));
      }
    }
  }, [organization, user, isEditMode]);

  useEffect(() => {
    if (formState.customer_id) {
      fetchAddresses(formState.customer_id);
      fetchOutstandingBalance(formState.customer_id);
    }
  }, [formState.customer_id]);

  useEffect(() => {
    if (isEditMode && initialInvoice && customers.length > 0 && billingAddresses.length > 0) {
      const customer = customers.find(c => c.id === initialInvoice.customer_id);
      if (customer) {
        const billingAddress = billingAddresses.find(a => a.id === initialInvoice.billing_address_id);
        const shippingAddress = shippingAddresses.find(a => a.id === initialInvoice.shipping_address_id);
        setFormState(prev => ({ ...prev, billing_address: billingAddress || null, shipping_address: shippingAddress || null }));
      }
    }
  }, [isEditMode, initialInvoice, customers, billingAddresses, shippingAddresses]);

  const handleAddCustomer = (newCustomer: any) => {
    setCustomers(prev => [...prev, newCustomer]);
    setFormState(prev => ({ ...prev, customer_id: newCustomer.id }));
    setIsModalOpen(false);
    fetchAddresses(newCustomer.id);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setFormState(prev => ({ ...prev, customer_id: customerId, billing_address_id: '', shipping_address_id: '', billing_address: null, shipping_address: null }));
    fetchAddresses(customerId);
    fetchOutstandingBalance(customerId);
  };

  const handleAddressChange = (type: 'billing' | 'shipping', addressId: string) => {
    if (addressId === 'add_new') {
      setAddressType(type);
      setIsAddressModalOpen(true);
      return;
    }
    const address = billingAddresses.find(a => a.id === addressId);
    setFormState(prev => ({ ...prev, [`${type}_address_id`]: addressId, [`${type}_address`]: address || null }));
  };

  const handleAddressAdded = (newAddress: any) => {
    if (addressType) {
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
        setFormState(prev => ({ ...prev, shipping_address_id: formState.billing_address_id, shipping_address: billingAddress }));
      }
    }
  };

  const handleTermChange = (term: string) => {
    setPaymentTerm(term);
    if (term === 'custom') {
      setIsCustomDueDate(true);
    } else {
      setIsCustomDueDate(false);
      const issueDate = new Date(formState.issue_date);
      const newDueDate = new Date(issueDate.setDate(issueDate.getDate() + parseInt(term, 10)));
      setFormState(prev => ({ ...prev, due_date: newDueDate.toISOString().split('T')[0] }));
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
    setFormState(prev => ({ ...prev, custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }] }));
  };

  const removeCustomField = (index: number) => {
    setFormState(prev => ({ ...prev, custom_fields: (prev.custom_fields || []).filter((_, i) => i !== index) }));
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
    setFormState(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_type: 'fixed', discount_amount: 0 }] }));
  };

  const removeItem = (index: number) => {
    setFormState(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (status: 'draft' | 'sent') => {
    setActiveAction(status);

    if (!isEditMode && !organization) {
      setErrors({ form: ['Organization context is not loaded yet. Please wait and try again.'] });
      setActiveAction(null);
      return;
    }

    const result = InvoiceSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setActiveAction(null);
      return;
    }

    const organizationId = isEditMode ? initialInvoice?.organization_id : organization?.id;

    if (!organizationId) {
      setErrors({ form: ['Could not determine the current organization.'] });
      setActiveAction(null);
      return;
    }

    if (formState.is_recurring) {
      try {
        const recurringData = { ...result.data, organization_id: organizationId };
        const res = await fetch('/api/recurring-invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recurringData) });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
          throw new Error(`Server Error: ${errorData.error || res.statusText}`);
        }
        router.push('/recurring-invoices');
      } catch (error: any) {
        setErrors({ form: [error.message] });
      } finally {
        setActiveAction(null);
      }
      return;
    }

    const url = isEditMode ? `/api/invoices/${initialInvoice?.id}` : '/api/invoices';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...result.data, status, organization_id: organizationId }) });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        throw new Error(`Server Error: ${errorData.error || res.statusText}`);
      }
      const { id } = await res.json();

      if (attachments.length > 0) {
        const uploadPromises = attachments.map(async (file) => {
          const filePath = `${user!.id}/${id}/${file.name}`;
          
          const { error: uploadError } = await supabase.storage.from('invoice-attachments').upload(filePath, file);
          if (uploadError) throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          return { name: file.name, path: filePath, size: file.size, type: file.type };
        });
        const uploadedAttachments = await Promise.all(uploadPromises);
        await fetch(`/api/invoices/${id}/attachments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attachments: uploadedAttachments }) });
      }
      router.push(`/invoices/${id}`);
    } catch (error: any) {
      setErrors({ form: [error.message] });
    } finally {
      setActiveAction(null);
    }
  };

  const onSaveDraft = (e: React.FormEvent) => { e.preventDefault(); handleSubmit('draft'); };
  const onSaveAndSend = (e: React.FormEvent) => { e.preventDefault(); handleSubmit('sent'); };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formState.customer_id);
    const invoiceDataForPdf: React.ComponentProps<typeof InvoicePDF>['invoice'] = {
      ...formState,
      items: formState.items.map(item => {
        const itemSubtotal = item.quantity * item.unit_price;
        let itemDiscount = 0;
        if (item.discount_type === 'percentage') itemDiscount = itemSubtotal * ((item.discount_amount || 0) / 100);
        else if (item.discount_type === 'fixed') itemDiscount = item.discount_amount || 0;
        const itemTax = (itemSubtotal - itemDiscount) * (item.tax_rate / 100);
        return { ...item, line_total: itemSubtotal - itemDiscount + itemTax };
      }),
      customers: customer || { name: 'N/A', email: '' },
      subtotal: subtotal,
      total_item_discount: totalItemDiscount,
      tax_amount: totalTax,
      overall_discount: overallDiscount,
      total_amount: total,
      balance_due: balanceDue,
      currency_symbol: currencySymbol,
    };
    const blob = await pdf(<InvoicePDF invoice={invoiceDataForPdf} />).toBlob();
    saveAs(blob, `Invoice-${formState.number}.pdf`);
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!templateId) {
      setFormState(defaultInitialState);
      fetchNextInvoiceNumber();
      return;
    }
    try {
      const res = await fetch(`/api/invoice-templates/${templateId}`);
      if (res.ok) {
        const { template_data } = await res.json();
        setFormState(prev => ({ ...mapInvoiceToFormState(template_data), number: prev.number }));
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
      const res = await fetch('/api/invoice-templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ template_name: templateName, template_data: result.data }) });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        throw new Error(`Server Error: ${errorData.error || res.statusText}`);
      }
      alert('Template saved successfully!');
    } catch (error: any) {
      setErrors({ form: [error.message] });
    } finally {
      setActiveAction(null);
    }
  };

  const { subtotal, totalItemDiscount, totalTax, overallDiscount, total, balanceDue } = useMemo(() => {
    let sub = 0, itemDiscountTotal = 0, taxTotal = 0;
    formState.items.forEach(item => {
      const itemSubtotal = (item.quantity || 0) * (item.unit_price || 0);
      let itemDiscount = 0;
      if (item.discount_type === 'percentage') itemDiscount = itemSubtotal * ((item.discount_amount || 0) / 100);
      else if (item.discount_type === 'fixed') itemDiscount = item.discount_amount || 0;
      const taxableAmount = itemSubtotal - itemDiscount;
      taxTotal += taxableAmount * ((item.tax_rate || 0) / 100);
      sub += itemSubtotal;
      itemDiscountTotal += itemDiscount;
    });
    const totalWithShipping = sub - itemDiscountTotal + taxTotal + (formState.shipping_cost || 0);
    let overallDisc = 0;
    if (formState.discount_type === 'percentage') overallDisc = totalWithShipping * ((formState.discount_amount || 0) / 100);
    else if (formState.discount_type === 'fixed') overallDisc = formState.discount_amount || 0;
    const grandTotal = totalWithShipping - overallDisc;
    return { subtotal: sub, totalItemDiscount: itemDiscountTotal, totalTax: taxTotal, overallDiscount: overallDisc, total: grandTotal, balanceDue: grandTotal + (outstandingBalance || 0) };
  }, [formState.items, formState.shipping_cost, formState.discount_type, formState.discount_amount, outstandingBalance]);
  
  const currencySymbol = getCurrencySymbol(formState.currency || 'USD');
  const selectedCustomer = useMemo(() => {
    if (isEditMode && initialInvoice?.customer) return initialInvoice.customer;
    if (!formState.customer_id || !customers.length) return null;
    return customers.find(c => c.id == formState.customer_id);
  }, [formState.customer_id, customers, initialInvoice, isEditMode]);

  const editorPanel = (
    <div className="space-y-4">
      <FormErrors errors={errors} />
      <CoreDetails
        formState={formState}
        handleInputChange={handleInputChange}
        customers={customers}
        handleCustomerChange={handleCustomerChange}
        setIsModalOpen={setIsModalOpen}
        errors={errors}
        billingAddresses={billingAddresses}
        shippingAddresses={shippingAddresses}
        handleAddressChange={handleAddressChange}
        copyBillingToShipping={copyBillingToShipping}
        isCustomDueDate={isCustomDueDate}
        paymentTerm={paymentTerm}
        handleTermChange={handleTermChange}
        router={router}
        user={user}
        organization={organization}
      />
      <InvoiceItems formState={formState} setFormState={setFormState} handleItemChange={handleItemChange} addItem={addItem} removeItem={removeItem} currencySymbol={currencySymbol} subtotal={subtotal} totalItemDiscount={totalItemDiscount} totalTax={totalTax} total={total} balanceDue={balanceDue} outstandingBalance={outstandingBalance} handleInputChange={handleInputChange} />
      <AdditionalInfo formState={formState} handleInputChange={handleInputChange} handleCustomFieldChange={handleCustomFieldChange} addCustomField={addCustomField} removeCustomField={removeCustomField} attachments={attachments} handleFileChange={handleFileChange} removeAttachment={removeAttachment} setFormState={setFormState} />
    </div>
  );

  const previewPanel = (
    <div className="lg:sticky top-8 h-full">
      <InvoiceTemplate
        number={formState.number}
        issue_date={formState.issue_date}
        due_date={formState.due_date}
        items={formState.items}
        notes={formState.notes}
        logo_url={formState.logo_url}
        color_theme={formState.color_theme}
        user_company_name={formState.user_company_name}
        user_address={formState.user_address}
        user_contact={formState.user_contact}
        currency={formState.currency}
        authorized_signature={formState.authorized_signature}
        billing_address={formState.billing_address}
        shipping_address={formState.shipping_address}
        shipping_method={formState.shipping_method}
        tracking_number={formState.tracking_number}
        shipping_cost={formState.shipping_cost}
        custom_fields={formState.custom_fields}
        is_recurring={formState.is_recurring}
        recurring_frequency={formState.recurring_frequency}
        recurring_start_date={formState.recurring_start_date}
        recurring_end_date={formState.recurring_end_date}
        paymentTerm={paymentTerm}
        customer={selectedCustomer}
        organization={organization}
        subtotal={subtotal}
        totalItemDiscount={totalItemDiscount}
        totalTax={totalTax}
        overallDiscount={overallDiscount}
        total={total}
        balanceDue={balanceDue}
        outstandingBalance={outstandingBalance}
        currencySymbol={currencySymbol}
      />
    </div>
  );

  return (
    <>
      {isModalOpen && <AddCustomerModal onAddCustomer={handleAddCustomer} onClose={() => setIsModalOpen(false)} />}
      {isAddressModalOpen && formState.customer_id && <AddAddressModal customerId={formState.customer_id} onClose={() => setIsAddressModalOpen(false)} onAddressAdded={handleAddressAdded} />}
      <div className="w-full mx-auto p-2 sm:p-4 lg:p-6">
        <InvoiceFormHeader isEditMode={isEditMode} formState={formState} templates={templates} handleTemplateChange={handleTemplateChange} />
        {isMobile ? (
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white/20 dark:bg-gray-800/20 p-1 mb-6 backdrop-blur-sm">
              {['Editor', 'Preview'].map((category) => (
                <Tab key={category} as={Fragment}>
                  {({ selected }) => <button className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${selected ? 'bg-white dark:bg-gray-700/50 shadow text-indigo-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-white/[0.12] hover:text-white'}`}>{category}</button>}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>{editorPanel}</Tab.Panel>
              <Tab.Panel>{previewPanel}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">{editorPanel}</div>
            <div className="lg:col-span-1 relative"><div className="sticky top-6">{previewPanel}</div></div>
          </div>
        )}
      </div>
      <InvoiceActions activeAction={activeAction} onSaveDraft={onSaveDraft} onSaveAndSend={onSaveAndSend} onSaveAsTemplate={handleSaveAsTemplate} onDownload={handleDownload} isRecurring={formState.is_recurring} disabled={!organization || !!activeAction} />
    </>
  );
}