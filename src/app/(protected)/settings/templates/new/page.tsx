
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoiceTemplatePage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');
  const [layout, setLayout] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [font, setFont] = useState('sans-serif');

  const handleSubmit = () => {
    // In a real app, you would save the template to the database
    router.push('/settings/templates');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Invoice Template</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <input type="text" placeholder="Template Name" value={templateName} onChange={e => setTemplateName(e.target.value)} className="input w-full" />
        <select value={layout} onChange={e => setLayout(e.target.value)} className="input w-full">
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
        </select>
        <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="input w-full" />
        <select value={font} onChange={e => setFont(e.target.value)} className="input w-full">
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className="btn-primary">Save Template</button>
        </div>
      </div>
    </div>
  );
}
