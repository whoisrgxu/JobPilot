"use client";
import React from "react";
import Link from "next/link";

interface RegisterSuccessProps {
  isPremium?: boolean;
  payToken?: string;
}

export default function RegisterSuccess({ isPremium = false, payToken }: RegisterSuccessProps) {
  const paymentHref = payToken ? `/payment?token=${encodeURIComponent(payToken)}` : "/payment";
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
      <p className="mb-6">Your account has been created successfully.</p>

      {isPremium ? (
        <Link
          href={paymentHref}
          className="mt-2 text-pink-500 underline hover:text-pink-600"
        >
          Continue to Payment
        </Link>
      ) : (
        <Link
          href="/login"
          className="mt-2 text-pink-500 underline hover:text-pink-600"
        >
          Go to Login
        </Link>
      )}
    </div>
  );
}
