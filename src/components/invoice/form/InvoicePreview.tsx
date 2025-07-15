// src/components/invoice/form/InvoicePreview.tsx
import React from 'react';
import Image from 'next/image';
import { toWords } from 'number-to-words';

interface InvoicePreviewProps {
  formState: any;
  subtotal: number;
  totalItemDiscount: number;
  totalTax: number;
  overallDiscount: number;
  total: number;
  balanceDue: number;
  outstandingBalance: number;
  currencySymbol: string;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  formState,
  subtotal,
  totalItemDiscount,
  totalTax,
  overallDiscount,
  total,
  balanceDue,
  outstandingBalance,
  currencySymbol,
}) => {
  return (
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
            {formState.custom_fields.map((field: any, index: number) => (
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
                {(formState.items || []).map((item: any, i: number) => (
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
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal:</p>
                    <p>{currencySymbol}{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Item Discounts:</p>
                    <p>-{currencySymbol}{totalItemDiscount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax:</p>
                    <p>{currencySymbol}{totalTax.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                    <p>Shipping:</p>
                    <p>{currencySymbol}{(formState.shipping_cost || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Discount:</p>
                    <p>-{currencySymbol}{overallDiscount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-white/20">
                    <p>Invoice Total:</p>
                    <p>{currencySymbol}{total.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                    <span>Previous Balance:</span>
                    <span>{currencySymbol}{outstandingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-white/20" style={{ color: formState.color_theme }}>
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
};

export default InvoicePreview;