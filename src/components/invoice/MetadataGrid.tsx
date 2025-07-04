import React from 'react';

type MetadataGridProps = {
  number: string;
  isEditingNumber: boolean;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditNumber: () => void;
  issueDate: string;
  onIssueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paymentTerms: string;
  onPaymentTermsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  termsOptions: string[];
  dueDate: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MetadataGrid: React.FC<MetadataGridProps> = ({
  number = '',
  isEditingNumber = false,
  onNumberChange,
  onEditNumber,
  issueDate = '',
  onIssueDateChange,
  paymentTerms = '',
  onPaymentTermsChange,
  termsOptions = [],
  dueDate = '',
  onDueDateChange,
}) => (
  <div className="w-full px-8 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {/* Invoice Number */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">Invoice#<span className="text-red-500">*</span></label>
        <div className="flex items-center gap-2">
          <input
            name="number"
            value={number}
            onChange={onNumberChange}
            className="w-full border border-gray-300 px-2 py-2 rounded-none bg-transparent text-base focus:border-blue-500"
            readOnly={!isEditingNumber}
            required
          />
          <button
            type="button"
            onClick={onEditNumber}
            className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
            title={isEditingNumber ? 'Lock' : 'Edit'}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16.862 5.487a2.06 2.06 0 0 1 2.916 2.914l-9.375 9.375a2 2 0 0 1-.707.464l-3.11 1.037a.5.5 0 0 1-.632-.632l1.037-3.11a2 2 0 0 1 .464-.707l9.375-9.375Z"/></svg>
          </button>
        </div>
      </div>
      {/* Invoice Date */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">Invoice Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          name="issue_date"
          value={issueDate}
          onChange={onIssueDateChange}
          className="w-full border border-gray-300 px-2 py-2 rounded-none bg-transparent text-base focus:border-blue-500"
          required
        />
      </div>
      {/* Terms */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">Terms</label>
        <select
          name="payment_terms"
          value={paymentTerms}
          onChange={onPaymentTermsChange}
          className="w-full border border-gray-300 px-2 py-2 rounded-none bg-transparent text-base focus:border-blue-500"
        >
          <option value="">Due on Receipt</option>
          {termsOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Due Date */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">Due Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          name="due_date"
          value={dueDate}
          onChange={onDueDateChange}
          className="w-full border border-gray-300 px-2 py-2 rounded-none bg-transparent text-base focus:border-blue-500"
          required
        />
      </div>
    </div>
  </div>
);

export default MetadataGrid; 