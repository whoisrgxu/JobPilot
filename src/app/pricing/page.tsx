'use client';

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "20 resume-to-job analyses per month",
      "Feedback insights",
      "Email support"
 
    ],
    cta: "Get Started",
    noMatch: "Switch to free"
  },
  {
    name: "Pro",
    price: "$9/mo",
    features: [
      "Unlimited resume-to-job analyses per month",
      "Feedback insights",
      "Priority email support",
      "Career Roadmap"
    ],
    cta: "Get Started",
    noMatch: "Upgrade"
  },
];

export default function Plans() {

  const user = useUser();

  let userPlan: string | undefined;

  if (user) {
    userPlan = user.isPremium? "Pro" : "Free"; 
  }
  const router = useRouter();
  const [planType, setPlanType] = useState("Pro");

  return (
    <main className="min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Choose A Plan
      </h1>
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            onClick={() => setPlanType(plan.name)}
            className={cn(
              "rounded-2xl shadow-md p-8 cursor-pointer transition-all",
              "bg-white dark:bg-gray-900",
              "border md:border-gray-300 dark:border-gray-500",
              planType === plan.name && "border-2 border-pink-600 scale-105"
            )}
          >
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4 text-center">
              {plan.name}
            </h2>
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-6 text-center">
              {plan.price}
            </div>
            <ul className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                if (userPlan !== undefined) {
                  router.push(`/changePlanTo${plan.name}`);
                }else {
                  router.push(`/register${plan.name}`);
                }
              }}
              className={cn(
                "w-full mt-2 text-white rounded-2xl font-semibold transition-colors",
                userPlan === plan.name
                  ? "hidden"
                  : "",
                planType === plan.name
                  ? "hover:brightness-110"
                  : "opacity-90 hover:bg-gray-400 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
              )}
              style={
                planType === plan.name
                  ? { backgroundColor: "oklch(59.2% 0.249 0.584)" }
                  : undefined
              }
            >
              {userPlan === undefined? plan.cta : (userPlan === plan.name? "" : plan.noMatch)}
            </Button>
            {userPlan === plan.name && (
              <div className="w-full mt-2 text-center text-green-600 dark:text-green-400 font-semibold">
                You are in {plan.name} tier!
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
