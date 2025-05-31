"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 pb-50">
      <div className="card w-full max-w-4xl">
        <div className="w-full whitespace-pre-wrap bg-[#1c1f2b] p-8 rounded-[10px] text-white">
          <h1 className="text-4xl sm:text-5xl font-bold text-left mb-6">
            Instantly Generate Tailored Cover Letters with AI
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mb-10">
            Save time and impress recruiters by creating professional, personalized cover letters in seconds — powered by GPT-4.1.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link
          href="/generate"
          className="px-6 py-2 text-white border-2 border-pink-500 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400"
        >
          Generate Your Cover Letter
        </Link>
      </div>
    </div>
  );
}
