
'use client';

import { useState } from 'react';

export default function LanguageSettingsPage() {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // In a real app, you would use a library like i18next to change the language
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Language Settings</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Select Language</h2>
        <select onChange={handleLanguageChange} value={language} className="input">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
