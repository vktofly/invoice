
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ invoiceId, amount }: { invoiceId: string, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || 'An error occurred.');
      setLoading(false);
      return;
    }

    // Here you would call your backend to create a PaymentIntent and confirm the payment
    console.log('PaymentMethod:', paymentMethod);
    // Example backend call:
    // const res = await fetch('/api/pay', { 
    //   method: 'POST', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount, invoiceId })
    // });
    // const paymentIntent = await res.json();
    // const { error: confirmError } = await stripe.confirmCardPayment(paymentIntent.client_secret);
    // if(confirmError) { ... }

    setLoading(false);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full mt-4">
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">Payment successful!</div>}
    </form>
  );
}

export default function PayInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    // Fetch invoice details to get the amount
    const fetchInvoice = async () => {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Pay Invoice #{invoice.number}</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <Elements stripe={stripePromise}>
          <CheckoutForm invoiceId={invoice.id} amount={invoice.total} />
        </Elements>
      </div>
    </div>
  );
}
