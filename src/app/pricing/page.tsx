'use client';
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import React from "react";

const plans = [
    {
        name: "Free",
        price: "$0",
        features: [
            "20 cover letters per month",
            "Basic templates",
            "Email support",
        ],
        cta: "Get Started",
    },
    {
        name: "Pro",
        price: "$9/mo",
        features: [
            "Unlimited cover letters",
            "Premium templates",
            "Priority email support",
            "AI suggestions",
        ],
        cta: "Upgrade",
        highlighted: true,
    },
];

export default function PricingPage() {

  const [menuOpen] = useAtom(menuOpenAtom);
    return (
        <main className={`min-h-screen py-12 px-4 ${menuOpen ? "hidden" : ""}`}>
            <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-lg shadow-lg p-8 bg-indigo-50 flex flex-col items-center ${
                            plan.highlighted ? "border-2 border-pink-600 scale-105" : ""
                        }`}
                    >
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{plan.name}</h2>
                        <div className="text-3xl font-bold text-gray-700 mb-6">{plan.price}</div>
                        <ul className="mb-6 space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="text-gray-700">
                                    • {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`px-6 py-2 rounded font-semibold ${
                                plan.highlighted
                                    ? "bg-pink-500 text-white hover:bg-pink-600"
                                    : "bg-gray-300 text-gray-800"
                            }`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}
