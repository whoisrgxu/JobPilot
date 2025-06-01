"use client";

import Link from "next/link";
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';


export default function Home() {

  const [menuOpen] = useAtom(menuOpenAtom);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 pb-20${menuOpen ? " hidden" : ""}`}
    >
      <div className="card w-full max-w-4xl">
        <div className="w-full whitespace-pre-wrap bg-[#1c1f2b] p-4 sm:p-8 rounded-[10px] text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-left mb-4 sm:mb-6">
            Instantly Generate Tailored Cover Letters with AI
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-6 sm:mb-10">
            Save time and impress recruiters by creating professional, personalized cover letters in seconds — powered by Google Gemini
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-10 w-full flex justify-center">
        <Link
          href="/generate"
          className="px-4 sm:px-6 py-2 text-white border-2 border-pink-500 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400 text-base sm:text-lg"
        >
          Generate Your Cover Letter
        </Link>
      </div>
    </div>
  );
}
