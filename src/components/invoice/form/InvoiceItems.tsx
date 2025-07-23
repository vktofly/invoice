// src/components/invoice/form/InvoiceItems.tsx
import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InvoiceItemsProps {
  formState: any;
  handleItemChange: (index: number, field: string, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  currencySymbol: string;
  subtotal: number;
  totalItemDiscount: number;
  totalTax: number;
  total: number;
  balanceDue: number;
  outstandingBalance: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  formState,
  handleItemChange,
  addItem,
  removeItem,
  currencySymbol,
  subtotal,
  totalItemDiscount,
  totalTax,
  total,
  balanceDue,
  outstandingBalance,
  handleInputChange,
  setFormState,
}) => {
  return (
    <div className="p-4 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-4 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
        <h2 className="text-lg font-semibold">Invoice Items</h2>
        <span className="text-sm">{formState.items.length} item(s)</span>
      </div>
      <div className="overflow-x-auto">
          <div className="hidden lg:grid grid-cols-12 gap-2 mb-2 items-center px-1 text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[700px]">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-1">Rate</div>
              <div className="col-span-1">Tax(%)</div>
              <div className="col-span-3">Discount</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1"></div>
          </div>
          <div className="lg:hidden grid grid-cols-12 gap-2 mb-2 items-center px-1 text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[600px]">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3">Rate</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
          </div>
          {(formState.items || []).map((item: any, index: number) => {
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
                      <div className="col-span-1 input bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-end text-gray-800 dark:text-gray-200">{currencySymbol}{itemTotal.toFixed(2)}</div>
                      <button onClick={() => removeItem(index)} className="btn-danger btn-sm p-2 justify-self-center"><TrashIcon className="h-4 w-4" /></button>
                  </div>
              );
          })}
      </div>
      <button onClick={addItem} className="btn-secondary mt-2"><PlusIcon className="h-4 w-4 mr-1" /> Add Item</button>
      <div className="mt-6 flex justify-end">
          <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Total Item Discount:</span>
                  <span>-{currencySymbol}{totalItemDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Total Tax:</span>
                  <span>{currencySymbol}{totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping:</span>
                <input
                  type="number"
                  name="shipping_cost"
                  value={formState.shipping_cost || 0}
                  onChange={e => setFormState(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) || 0 }))}
                  className="input w-24 text-right text-sm"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
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
                    value={formState.discount_amount || 0}
                    onChange={e => setFormState(prev => ({ ...prev, discount_amount: parseFloat(e.target.value) || 0 }))}
                    className="input w-24 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/20">
                  <span>Invoice Total:</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Previous Balance:</span>
                  <span>{currencySymbol}{outstandingBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-white/20 text-indigo-600 dark:text-indigo-400">
                  <span>Balance Due:</span>
                  <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InvoiceItems;