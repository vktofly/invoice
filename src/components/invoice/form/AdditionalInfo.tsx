// src/components/invoice/form/AdditionalInfo.tsx
import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AdditionalInfoProps {
  formState: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCustomFieldChange: (index: number, field: 'key' | 'value', value: string) => void;
  addCustomField: () => void;
  removeCustomField: (index: number) => void;
  attachments: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: (index: number) => void;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  formState,
  handleInputChange,
  handleCustomFieldChange,
  addCustomField,
  removeCustomField,
  attachments,
  handleFileChange,
  removeAttachment,
  setFormState,
}) => {
  return (
    <div className="p-4 bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-4 text-white p-3 rounded-lg" style={{ backgroundColor: formState.color_theme }}>
        <h2 className="text-lg font-semibold">Additional Information</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">Custom Fields</h3>
          <div className="space-y-4">
            {(formState.custom_fields || []).map((field: any, index: number) => (
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
                  className="btn-danger btn-sm p-2 flex items-center gap-1 justify-self-start md:justify-self-center"
                >
                  <TrashIcon className="h-4 w-4" />
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
          <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">Attachments</h3>
          <div className="flex items-center">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="input-file"
            />
          </div>
          {attachments.length > 0 && (
            <div className="mt-4">
              <ul className="divide-y divide-gray-200/50">
                {attachments.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span className="text-sm truncate pr-2">{file.name}</span>
                    <button onClick={() => removeAttachment(index)} className="btn-danger btn-sm p-1"><TrashIcon className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">Recurring Invoice</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_recurring"
              id="is_recurring"
              checked={formState.is_recurring}
              onChange={e => setFormState(prev => ({ ...prev, is_recurring: e.target.checked }))}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
            />
            <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-800 dark:text-gray-200">
              This is a recurring invoice
            </label>
          </div>
          {formState.is_recurring && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="recurring_frequency" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Frequency</label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">Notes & Customization</h3>
          <textarea name="notes" value={formState.notes} onChange={handleInputChange} className="input w-full" rows={3}></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input type="text" name="logo_url" placeholder="Logo URL" value={formState.logo_url} onChange={handleInputChange} className="input" />
            <input type="color" name="color_theme" value={formState.color_theme} onChange={handleInputChange} className="input h-10" />
          </div>
          <div className="mt-4">
            <label htmlFor="authorized_signature" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Authorized Signature</label>
            <input type="text" id="authorized_signature" name="authorized_signature" value={formState.authorized_signature} onChange={handleInputChange} className="input w-full" placeholder="Enter name for signature" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;