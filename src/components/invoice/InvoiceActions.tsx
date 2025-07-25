import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type InvoiceActionsProps = {
  activeAction: string | null;
  onSaveDraft: (e: React.FormEvent) => void;
  onSaveAndSend: (e: React.FormEvent) => void;
  onSaveAsTemplate: (e: React.FormEvent) => void;
  onDownload: (e: React.FormEvent) => void;
  isRecurring: boolean;
  disabled?: boolean;
};

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  activeAction,
  onSaveDraft,
  onSaveAndSend,
  onSaveAsTemplate,
  onDownload,
  isRecurring,
  disabled = false,
}) => (
  <div className="sticky bottom-0 left-0 right-0 w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/50 shadow-lg z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center gap-4 py-4">
            <button
              type="button"
              disabled={!!activeAction}
              onClick={onDownload}
              className="btn-secondary flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              {activeAction === 'download' ? 'Generating...' : 'Download'}
            </button>
            <button
            type="button"
            disabled={!!activeAction}
            onClick={onSaveAsTemplate}
            className="btn-secondary"
            >
            {activeAction === 'template' ? 'Saving...' : 'Save as Template'}
            </button>
            <button
            type="submit"
            disabled={disabled || !!activeAction}
            className="btn-secondary"
            onClick={onSaveDraft}
            >
            {activeAction === 'draft' ? 'Saving…' : 'Save Draft'}
            </button>
            <button
            type="button"
            disabled={disabled || !!activeAction}
            onClick={onSaveAndSend}
            className="btn-primary"
            >
            {activeAction === 'sent' ? (isRecurring ? 'Saving...' : 'Sending...') : (isRecurring ? 'Save Recurring Invoice' : 'Save & Send')}
            </button>
        </div>
    </div>
  </div>
);

export default InvoiceActions;