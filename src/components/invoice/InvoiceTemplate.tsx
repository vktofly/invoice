import React from 'react';
import Image from 'next/image';
import { toWords } from 'number-to-words';
import { Customer } from '@/lib/types';

interface InvoiceTemplateProps {
  number?: string;
  issue_date: string;
  due_date: string;
  items: Array<{
    description?: string;
    quantity?: number;
    unit_price?: number;
    tax_rate?: number;
    discount_type?: 'fixed' | 'percentage';
    discount_amount?: number;
  }>;
  notes?: string;
  logo_url?: string;
  color_theme?: string;
  user_company_name?: string;
  user_address?: string;
  user_contact?: string;
  currency?: string;
  authorized_signature?: string;
  billing_address?: any;
  shipping_address?: any;
  shipping_method?: string;
  tracking_number?: string;
  shipping_cost?: number;
  custom_fields?: Array<{ key?: string; value?: string }>;
  is_recurring?: boolean;
  recurring_frequency?: string;
  recurring_start_date?: string;
  recurring_end_date?: string | null;
  paymentTerm?: string;
  customer: Customer | null;
  organization: any | null;
  subtotal: number;
  totalItemDiscount: number;
  totalTax: number;
  overallDiscount: number;
  total: number;
  balanceDue: number;
  outstandingBalance: number;
  currencySymbol: string;
}

const calculateItemTotal = (item: InvoiceTemplateProps['items'][0]) => {
  const basePrice = item.quantity * item.unit_price;
  const discount = item.discount_amount || 0;
  const discountedPrice = basePrice - discount;
  const tax = discountedPrice * (item.tax_rate / 100);
  return discountedPrice + tax;
};

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  number,
  issue_date,
  due_date,
  items,
  notes,
  logo_url,
  color_theme = '#4f46e5',
  authorized_signature,
  billing_address,
  shipping_address,
  shipping_method,
  tracking_number,
  shipping_cost = 0,
  custom_fields = [],
  is_recurring,
  recurring_frequency,
  recurring_start_date,
  recurring_end_date,
  paymentTerm,
  customer,
  organization,
  subtotal,
  totalItemDiscount,
  totalTax,
  overallDiscount,
  total,
  balanceDue,
  outstandingBalance,
  currencySymbol,
  user_company_name,
  user_address,
  user_contact,
}) => {
  // Prioritize organization details, fall back to invoice details
  const companyName = organization?.name || user_company_name || 'Your Company';
  const companyAddress = organization?.address || user_address || '123 Your Street, Your City, 12345';
  const companyContact = organization?.contact_email || user_contact || 'your.email@example.com';

  const getTermLabel = (term: string | undefined) => {
    if (!term) return '';
    if (term === 'custom') return 'Custom';
    return `Net ${term}`;
  }

  return (
    <div className="p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/50 shadow-lg text-gray-800 dark:text-gray-200 print:shadow-none print:border-none print:bg-white print:text-black">
      <div className="flex justify-between items-start pb-8 mb-8 border-b border-gray-300/80 dark:border-gray-700/80" style={{ borderColor: color_theme }}>
        <div>
          {logo_url && <Image src={logo_url} alt="logo" width={50} height={50} className="mb-4 rounded-lg" />}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{companyName}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{companyAddress}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{companyContact}</p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold" style={{ color: color_theme }}>INVOICE</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1"># {number}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Billed To:</p>
          {customer ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">{customer.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{customer.email}</p>
              {billing_address ? (
                <div className="text-gray-500 dark:text-gray-400 mt-2">
                  <p>{billing_address.address_line1}</p>
                  {billing_address.address_line2 && <p>{billing_address.address_line2}</p>}
                  <p>{billing_address.city}, {billing_address.state} {billing_address.postal_code}</p>
                  <p>{billing_address.country}</p>
                </div>
              ) : <p className="text-gray-500 mt-2">No billing address.</p>}
            </>
          ) : <p className="text-gray-500">N/A</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Shipped To:</p>
          {shipping_address ? (
            <div className="text-gray-600">
              <p>{shipping_address.address_line1}</p>
              {shipping_address.address_line2 && <p>{shipping_address.address_line2}</p>}
              <p>{shipping_address.city}, {shipping_address.state} {shipping_address.postal_code}</p>
              <p>{shipping_address.country}</p>
            </div>
          ) : <p className="text-gray-500">N/A</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Invoice Date:</p>
          <p className="text-gray-500 dark:text-gray-400">{issue_date}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Payment Terms:</p>
          <p className="text-gray-500 dark:text-gray-400">{getTermLabel(paymentTerm)}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Due Date:</p>
          <p className="text-gray-500 dark:text-gray-400">{due_date}</p>
        </div>
      </div>

      {is_recurring && (
        <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Recurring Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                    <p className="font-medium text-gray-600">Frequency:</p>
                    <p className="text-gray-800 capitalize">{recurring_frequency}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-600">Start Date:</p>
                    <p className="text-gray-800">{recurring_start_date}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-600">End Date:</p>
                    <p className="text-gray-800">{recurring_end_date || 'Ongoing'}</p>
                </div>
            </div>
        </div>
      )}

      {(shipping_method || tracking_number || (custom_fields && custom_fields.length > 0)) && (
        <div className="mb-8">
          {custom_fields && custom_fields.map((field, index) => (
            <div key={index} className="grid grid-cols-2 gap-8">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{field.key}:</p>
              <p className="text-gray-600 text-right">{field.value}</p>
            </div>
          ))}
          {shipping_method && <p>Shipping Method: {shipping_method}</p>}
          {tracking_number && <p>Tracking #: {tracking_number}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead style={{ backgroundColor: color_theme }}>
            <tr>
              <th className="p-3 text-white font-semibold rounded-tl-lg">Description</th>
              <th className="p-3 text-white font-semibold text-center">Qty</th>
              <th className="p-3 text-white font-semibold text-right">Price</th>
              <th className="p-3 text-white font-semibold text-right">Tax (%)</th>
              <th className="p-3 text-white font-semibold text-right">Discount</th>
              <th className="p-3 text-white font-semibold text-right rounded-tr-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200/80 dark:border-gray-700/80">
                <td className="p-3">{item.description || '-'}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                <td className="p-3 text-right">{item.tax_rate.toFixed(2)}%</td>
                <td className="p-3 text-right">{currencySymbol}{(item.discount_amount || 0).toFixed(2)}</td>
                <td className="p-3 text-right font-semibold">{currencySymbol}{calculateItemTotal(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-gray-600">
            <p>Subtotal:</p>
            <p>{currencySymbol}{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Item Discounts:</p>
            <p>-{currencySymbol}{totalItemDiscount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Tax:</p>
            <p>{currencySymbol}{totalTax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Shipping:</p>
            <p>{currencySymbol}{shipping_cost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Overall Discount:</p>
            <p>-{currencySymbol}{overallDiscount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-300/80 dark:border-gray-700/80">
            <p>Invoice Total:</p>
            <p>{currencySymbol}{total.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Previous Balance:</span>
            <span>{currencySymbol}{outstandingBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t-2 text-indigo-600 dark:text-indigo-400" style={{ borderColor: color_theme }}>
            <p>Balance Due:</p>
            <p>{currencySymbol}{balanceDue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p className="font-semibold text-gray-800 dark:text-gray-200">In Words:</p>
        <p className="capitalize">{toWords(total)}</p>
      </div>

      {notes && (
        <div className="mt-8">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Notes:</p>
          <p className="text-gray-600 whitespace-pre-line">{notes}</p>
        </div>
      )}

      {authorized_signature && (
        <div className="mt-12 pt-8 border-t border-gray-200/80 dark:border-gray-700/80 text-right">
          <p className="font-semibold text-gray-800" style={{ fontFamily: '"Dancing Script", cursive' }}>{authorized_signature}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Authorized Signature</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplate;