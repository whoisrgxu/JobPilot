import React from "react";
import Link from "next/link";

const faqs = [
    {
        question: "What is Smart Cover Letter?",
        answer:
            "Smart Cover Letter is an AI-powered tool that helps you quickly generate personalized cover letters tailored to your job applications.",
    },
    {
        question: "How much does Smart Cover Letter cost?",
        answer:
            "We offer a free basic plan with limited features. Our premium plan starts at $9.99/month and unlocks unlimited cover letter generations and advanced customization options.",
    },
    {
        question: "How do I get started?",
        answer:
            "Simply sign up on our homepage, choose your plan, and start generating cover letters in minutes.",
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer:
            "Yes, you can cancel your subscription at any time from your account settings. Your access will remain until the end of your billing period.",
    },
    {
        question: "Is my data secure?",
        answer:
            "Absolutely. We use industry-standard encryption and never share your data with third parties.",
    },
];

export default function FAQPage() {
    return (
        <main className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-10">Frequently Asked Questions</h1>
            <div className="space-y-6">
                {faqs.map((faq, idx) => (
                    <div key={idx}>
                        <h2 className="text-xl font-semibold">{faq.question}</h2>
                        <p className="text-gray-400">{faq.answer}</p>
                    </div>
                ))}
            </div>
            <div className="mt-10">
                <p>
                    Still have questions? Visit our{" "}
                    <Link href="/" className="text-pink-500 hover:text-pink-600 underline">
                        Home
                    </Link>{" "}
                    page or check out our{" "}
                    <Link href="/pricing" className="text-pink-500 hover:text-pink-600 underline">
                        Pricing
                    </Link>{" "}
                    for more details.
                </p>
            </div>
        </main>
    );
}