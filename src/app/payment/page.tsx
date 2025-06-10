'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    if (!stripe || !elements) return;

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 900 }) // $9.00
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
        billing_details: { name }
      }
    });

    if (result.error) {
      setStatus(`Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent?.status === 'succeeded') {
      setStatus('✅ Payment successful!');
    }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#a0aec0' }
      },
      invalid: { color: '#fa755a' }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-25 p-6 md:border rounded shadow-lg shadow-gray-300">
      <h2 className="text-xl font-semibold mb-6">Pay with Stripe</h2>

      <label className="block mb-4">
        Name on Card
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full mt-2 px-3 py-2 border rounded"
        />
      </label>


<label className="block mb-4 relative">
  Card Number
  <div className="relative">
    <CardNumberElement
      options={elementStyle}
      className="mt-2 w-full p-2 pr-28 border rounded"
    />
    <div className="absolute top-1/2 right-3 flex space-x-1 transform -translate-y-1/2">
      <Image
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg"
        alt="Visa"
        width={20}
        height={20}
      />
      <Image
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg"
        alt="Mastercard"
        width={20}
        height={20}
      />
      <Image
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg"
        alt="Amex"
        width={20}
        height={20}
      />
      <Image
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/applepay.svg"
        alt="UnionPay"
        width={20}
        height={20}
      />
    </div>
  </div>
</label>



      <div className="flex gap-3 mb-4">
        <label className="flex-1 block">
          Expiry
          <CardExpiryElement
            options={elementStyle}
            className="mt-2 p-2 border rounded"
          />
        </label>

        <label className="flex-1 block">
          CVC
          <CardCvcElement
            options={elementStyle}
            className="mt-2 p-2 border rounded"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-pink-600 text-white rounded hover:bg-pink-700"
        disabled={!stripe}
      >
        Pay $9.00
      </button>

      {status && <p className="mt-4 text-sm text-center">{status}</p>}
    </form>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
