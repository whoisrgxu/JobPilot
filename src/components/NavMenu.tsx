'use client';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from "jotai";
import { menuOpenAtom } from "@/store/atoms";

export default function NavMenu() {
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);

  return (
    <nav className="flex flex-col md:flex-row p-4 md:p-8 items-center md:items-start">
      <div className="w-full md:w-1/3 text-left text-xl font-bold flex justify-between items-center">
        CoverCraft
        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseIcon fontSize="large" />
          ) : (
            <MenuIcon fontSize="large" />
          )}
        </button>
      </div>
      <ul
        className={`
          w-full md:w-2/3
          flex-col md:flex-row
          flex
          ${menuOpen ? 'flex' : 'hidden'}
          md:flex
          justify-center space-y-4 md:space-y-0 md:space-x-8
          text-md font-medium
          mt-4 md:mt-0
        `}
      >
        <li>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link href="/generate" onClick={() => setMenuOpen(false)}>Generate Cover Letter</Link>
        </li>
        <li>
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
        </li>
        <li>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        </li>
        <li>
          <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
        </li>
        <li>
          <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
        </li>
        <li>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}