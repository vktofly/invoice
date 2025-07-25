
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InvoiceTemplatesPage() {
  const [templates, setTemplates] = useState([
    { id: '1', name: 'Modern' },
    { id: '2', name: 'Classic' },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Templates</h1>
        <Link href="/settings/templates/new" className="btn-primary">New Template</Link>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <ul>
          {templates.map(template => (
            <li key={template.id} className="flex justify-between items-center py-2 border-b">
              <span>{template.name}</span>
              <Link href={`/settings/templates/${template.id}`} className="text-indigo-600 hover:underline">Edit</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
