'use client';
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import Link from 'next/link';

export default function FAQPage() {
  const [menuOpen] = useAtom(menuOpenAtom);

  return (
    <div className={`max-w-5xl min-h-screen mx-auto px-6 py-12 ${menuOpen ? "hidden" : ""} bg-[#faf6f6] dark:bg-[#0a0a0a] mb-10`}>
      <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center text-neutral-800 dark:text-white">
        Frequently Asked Questions
      </h1>

      <div className="grid gap-10 md:gap-12 text-base md:text-lg leading-relaxed">
        {/* What is Smart Cover Letter? */}
        <section className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-800 dark:text-white">What is Smart Cover Letter?</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Smart Cover Letter is an AI-powered tool that helps you quickly generate personalized cover letters tailored to your job applications. Just upload your resume and job description — we’ll do the rest.
          </p>
        </section>

        {/* How much does it cost? */}
        <section className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-800 dark:text-white">How much does it cost?</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            We offer two plans:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-700 dark:text-neutral-300">
            <li><strong>Free Plan</strong>: Use up to 20 cover letter generations per month.</li>
            <li><strong>Pro Plan</strong>: Unlimited generations with access to all advanced features, starting at just $9.99/month.</li>
          </ul>
        </section>

        {/* How to get started? */}
        <section className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-800 dark:text-white">How do I get started?</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Simply sign up on our homepage, choose the plan that fits you, and start generating cover letters in minutes.
          </p>
        </section>

        {/* Cancel subscription */}
        <section className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-800 dark:text-white">Can I cancel my subscription anytime?</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Yes, you can cancel anytime through your account settings. You’ll continue to have access until the end of your current billing cycle.
          </p>
        </section>

        {/* Data security */}
        <section className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-800 dark:text-white">Is my data secure?</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Absolutely. We use industry-standard encryption protocols and never share your data with any third parties.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-xl p-6 md:p-8 shadow-md border border-pink-300 dark:border-pink-700">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-700 dark:text-pink-200">Still have questions?</h2>
          <p>
            Visit our <Link href="/" className="underline hover:text-pink-600 dark:hover:text-pink-300">Home</Link> page or check out our <a href="/pricing" className="underline hover:text-pink-600 dark:hover:text-pink-300">Pricing</a> for more details.
          </p>
        </section>
      </div>
    </div>
  );
}
