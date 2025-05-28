"use client";

import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col p-8">
      <h1 className="w-1/2 text-4xl sm:text-5xl font-bold text-left mb-6">
        Instantly Generate Tailored Cover Letters with AI
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-10">
        Save time and impress recruiters by creating professional, personalized cover letters in seconds — powered by GPT-4.1.
      </p>

    <Link
      href="/generate"
      className="bg-blue-600 w-50 text-white px-4 py-2 rounded text-lg text-center hover:bg-blue-700 transition"
    >
      Generate Your Cover Letter
    </Link>
    </div>
  );
}
