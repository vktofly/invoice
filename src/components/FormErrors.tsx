import React from 'react';

type FormErrorsProps = {
  errors: Record<string, string[] | undefined>;
};

const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
  const errorMessages = Object.entries(errors)
    .filter(([, messages]) => messages && messages.length > 0)
    .map(([field, messages]) => ({
      field: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      message: messages![0],
    }));

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
      <ul className="list-disc list-inside space-y-1 text-red-700">
        {errorMessages.map(({ field, message }) => (
          <li key={field}>
            <span className="font-semibold">{field}:</span> {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormErrors;
