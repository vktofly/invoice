import React from 'react';

type InvoiceActionsProps = {
  loading: boolean;
  onSaveDraft: (e: React.FormEvent) => void;
  onSaveAndSend: (e: React.FormEvent) => void;
};

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  loading,
  onSaveDraft,
  onSaveAndSend,
}) => (
  <div className="flex gap-3 mt-8 mb-2 px-8">
    <button
      type="submit"
      disabled={loading}
      className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      onClick={onSaveDraft}
    >
      {loading ? 'Saving…' : 'Save Draft'}
    </button>
    <button
      type="button"
      disabled={loading}
      onClick={onSaveAndSend}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Sending…' : 'Save & Send'}
    </button>
  </div>
);

export default InvoiceActions;