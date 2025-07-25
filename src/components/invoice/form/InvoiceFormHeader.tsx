// src/components/invoice/form/InvoiceFormHeader.tsx
import React from 'react';

interface InvoiceFormHeaderProps {
  isEditMode: boolean;
  formState: {
    number?: string;
    color_theme?: string;
  };
  templates: any[];
  handleTemplateChange: (templateId: string) => void;
}

const InvoiceFormHeader: React.FC<InvoiceFormHeaderProps> = ({
  isEditMode,
  formState,
  templates,
  handleTemplateChange,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h1>
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
  );
};

export default InvoiceFormHeader;