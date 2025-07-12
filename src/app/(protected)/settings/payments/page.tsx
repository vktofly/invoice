
'use client';

import { useState } from 'react';

export default function PaymentSettingsPage() {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeApiKey, setStripeApiKey] = useState('');

  const handleConnectStripe = () => {
    // In a real app, this would redirect to Stripe's OAuth flow
    setStripeConnected(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Stripe Integration</h2>
        {stripeConnected ? (
          <p>Your Stripe account is connected.</p>
        ) : (
          <button onClick={handleConnectStripe} className="btn-primary">Connect with Stripe</button>
        )}

        <div className="mt-4">
          <label htmlFor="stripeApiKey" className="block text-sm font-medium text-gray-700">Stripe API Key</label>
          <input
            type="text"
            id="stripeApiKey"
            value={stripeApiKey}
            onChange={e => setStripeApiKey(e.target.value)}
            className="input w-full max-w-md mt-1"
            placeholder="sk_test_..."
          />
        </div>
      </div>
    </div>
  );
}
