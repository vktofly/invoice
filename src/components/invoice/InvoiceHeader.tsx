import React from 'react';

const InvoiceHeader = () => (
  <div className="flex items-center gap-4 mb-8 px-8 pt-8">
    <span className="inline-block text-2xl text-blue-600"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v4h10V3"/></svg></span>
    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">New Invoice</h1>
    <div className="ml-4 flex items-center gap-2">
      <span className="text-sm text-gray-700">Use Simplified View</span>
      <label className="inline-flex relative items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition"></div>
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
      </label>
    </div>
  </div>
);

export default InvoiceHeader; 