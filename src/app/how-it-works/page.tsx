'use client';
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';

export default function HowItWorksPage() {
  const [menuOpen] = useAtom(menuOpenAtom);

  return (
    <div className={`max-w-4xl mx-auto px-6 py-12 ${menuOpen ? "hidden" : ""}`}>
      <h1 className="text-4xl font-bold mb-6 text-center">How It Works</h1>

      <div className="space-y-10 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Input Your Resume & Job Description</h2>
          <p>
            Simply paste your resume and the job description into the form — or upload your resume as a PDF.
            We support both formats so you can choose what works best for you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. AI Builds Your Cover Letter</h2>
          <p>
            Our tool uses advanced AI models to read and understand your resume and the job posting. 
            It then generates a personalized, professional cover letter tailored to the specific opportunity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Review and Customize</h2>
          <p>
            You will see your generated cover letter right away. You can copy it, edit it, or use it as a starting point 
            to craft your final version.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Why Use Our Tool?</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Save time — no more struggling to start from scratch.</li>
            <li>Stand out — our AI highlights your most relevant skills and experience.</li>
            <li>Stay professional — polished tone and structure in seconds.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
