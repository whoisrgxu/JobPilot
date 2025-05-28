'use client';

import Link from 'next/link';       

export default function NavMenu() {
  return (
    <nav className="flex p-8">
      <div className="w-1/3 text-left text-xl font-bold">CoverCraft</div>
      <ul className="w-2/3 flex justify-center space-x-18 text-md font-medium">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/generate">Generate Cover Letter</Link></li>
        <li><Link href="/how-it-works">How It Works</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/faq">FAQ</Link></li>
      </ul>
    </nav>
  );
}