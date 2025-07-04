import React from 'react';

type NotesTermsPaymentProps = {
  notes: string;
  setNotes: (notes: string) => void;
  showTerms: boolean;
  setShowTerms: (show: boolean) => void;
  terms: string;
  setTerms: (terms: string) => void;
  showPaymentGateway: boolean;
  setShowPaymentGateway: (show: boolean) => void;
};

const NotesTermsPayment: React.FC<NotesTermsPaymentProps> = ({
  notes,
  setNotes,
  showTerms,
  setShowTerms,
  terms,
  setTerms,
  showPaymentGateway,
  setShowPaymentGateway,
}) => (
  <div className="w-full px-8 mb-10">
    {/* Customer Notes */}
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1 text-gray-800">Customer Notes</label>
      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Thanks for your business."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <div className="text-xs text-gray-500 mt-1">Will be displayed on the invoice</div>
    </div>
    {/* Terms & Conditions */}
    <div className="mb-4">
      <button
        type="button"
        className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1"
        onClick={() => setShowTerms(!showTerms)}
      >
        <span>+ Add Terms and conditions</span>
      </button>
      {showTerms && (
        <textarea
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Enter terms and conditions"
          value={terms}
          onChange={e => setTerms(e.target.value)}
        />
      )}
    </div>
    {/* Payment Gateway */}
    <div>
      <button
        type="button"
        className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1"
        onClick={() => setShowPaymentGateway(!showPaymentGateway)}
      >
        <span>+ Add Payment Gateway</span>
      </button>
      {showPaymentGateway && (
        <div className="w-full border px-3 py-2 rounded mb-2 text-gray-500 bg-gray-50">
          Payment gateway integration coming soon.
        </div>
      )}
    </div>
  </div>
);

export default NotesTermsPayment;
