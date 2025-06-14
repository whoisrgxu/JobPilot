'use client';

import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    if (!stripe || !elements) return;

    setIsLoading(true);

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

    setIsLoading(false);
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        '::placeholder': { color: '#9ca3af' }
      },
      invalid: { color: '#f87171' }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "border md:border md:border-gray-300 dark:md:border-gray-500 rounded-2xl shadow-md",
        "max-w-[28rem] mx-auto p-6",
        "mt-20 md:mt-40",
        "bg-gray-50 dark:bg-gray-950"
      )}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Pay with Stripe</h2>

      <div className="mb-4">
        <Label htmlFor="card-name" className="text-gray-700 dark:text-white">Name on Card</Label>
        <Input
          id="card-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white text-black dark:bg-gray-800 dark:text-white mt-1"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="card-number" className="text-gray-700 dark:text-white">Card Number</Label>
        <div className="relative">
          <CardNumberElement
            id="card-number"
            options={elementStyle}
            className="mt-2 w-full p-2 pr-28 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
          />
          <div className="absolute top-1/2 right-3 flex space-x-1 transform -translate-y-1/2 dark:invert">
            <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg" alt="Visa" width={20} height={20} />
            <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg" alt="Mastercard" width={20} height={20} />
            <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg" alt="Amex" width={20} height={20} />
            <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/applepay.svg" alt="ApplePay" width={20} height={20} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Label className="text-gray-700 dark:text-white">Expiry</Label>
          <CardExpiryElement
            options={elementStyle}
            className="mt-2 p-2 border rounded-md w-full bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <Label className="text-gray-700 dark:text-white">CVC</Label>
          <CardCvcElement
            options={elementStyle}
            className="mt-2 p-2 border rounded-md w-full bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full py-2.5 mt-2 text-white cursor-pointer hover:brightness-110 transition-colors flex items-center justify-center gap-2 rounded-md"
        style={{ backgroundColor: 'oklch(59.2% 0.249 0.584)' }}
        disabled={!stripe || isLoading}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Pay $9.00
      </Button>

      {status && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 text-center">{status}</p>
      )}
    </form>
  );
}

export default function PaymentPage() {

  const router = useRouter();
  const hasValidate = useRef(false);
  useEffect(() => {
    if (hasValidate.current) return;
    hasValidate.current = true;
    const PremiumRegisteringInProgress = localStorage.getItem("PremiumRegisteringInProgress");
    console.log("PremiumRegisteringInProgress: ", PremiumRegisteringInProgress);
    if (PremiumRegisteringInProgress !== "true") {
      router.replace("/login"); 
    } else {
      // Delay removal to avoid race condition on re-runs
      setTimeout(() => {
        localStorage.removeItem("PremiumRegisteringInProgress");
      }, 1000);
    }
  }, [router]);
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
