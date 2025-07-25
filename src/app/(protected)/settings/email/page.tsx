
'use client';

import { useState } from 'react';

export default function EmailSettingsPage() {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [emailSignature, setEmailSignature] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Email Settings</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <input type="text" placeholder="From Name" value={fromName} onChange={e => setFromName(e.target.value)} className="input w-full" />
        <input type="email" placeholder="From Email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="input w-full" />
        <textarea placeholder="Email Signature" value={emailSignature} onChange={e => setEmailSignature(e.target.value)} className="input w-full"></textarea>
        <div className="flex justify-end">
          <button className="btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
