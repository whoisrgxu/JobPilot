"use client";

import Link from "next/link";
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';


export default function Home() {

  const [menuOpen] = useAtom(menuOpenAtom);

  return (
    <div
      className={`min-h-screen flex flex-col dark:bg-black pt-30 md:justify-center p-4 sm:p-8 pb-20${menuOpen ? " hidden" : ""}`}
    >
      <div className="card w-full max-w-4xl">
        <div className="w-full whitespace-pre-wrap bg-gray-50 p-4 sm:p-8 rounded-[10px] text-neutral-700 dark:bg-gray-950 dark:text-rose-50">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-left mb-4 sm:mb-6">
            Instantly Generate Tailored Cover Letters with AI
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mb-6 sm:mb-10">
            Save time and impress recruiters by creating professional, personalized cover letters in seconds — powered by Open AI and Google Gemini
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-10 w-full flex justify-center">
        <Link
          href="/generate"
          className="px-4 sm:px-6 py-2 bg-black dark:bg-[#faf6f6] dark:text-black text-white rounded-xl transition duration-200 ease-in-out dark:hover:bg-gray-300 hover:bg-gray-700 text-base sm:text-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
