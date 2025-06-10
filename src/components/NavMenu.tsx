'use client';
import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from "jotai";
import { menuOpenAtom } from "@/store/atoms";
import ThemeToggle from './ThemeToggle';
import NavItem from './NavItem';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


export default function NavMenu() {
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);
  // get token from local storage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email || "");
      } catch {
        setEmail("");
      }
    }
  }, [token]);

  return (
    <nav className=" bg-white dark:bg-neutral-950 dark:border-neutral-800 border-rose-100 border-b-1 dark:text-neutral-400 text-neutral-500 flex flex-col lg:flex-row p-4 lg:p-2 items-center lg:items-start">
      <div className="w-full lg:w-1/3 text-left text-xl font-bold flex justify-between items-center">
        <div className='text-black dark:text-white'><RocketLaunchIcon/>JobPilot</div>
        <button
          className="lg:hidden p-2"
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
          w-full lg:w-4/5
          flex-col lg:flex-row
          flex
          ${menuOpen ? 'flex' : 'hidden'}
          lg:flex
          justify-center space-y-4 lg:space-y-0 xl:space-x-4 lg:space-x-2
          text-md font-medium
          mt-4 lg:mt-0
        `}
      >
        {/* Navigation Links */}
        <NavItem href="/" onClick={() => setMenuOpen(false)}>Home</NavItem>
        <NavItem href="/generate" onClick={() => setMenuOpen(false)}>Generate Cover Letter</NavItem>
        <NavItem href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</NavItem>
        <NavItem href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</NavItem>
        <NavItem href="/faq" onClick={() => setMenuOpen(false)}>FAQ</NavItem>
          {email.length > 0 ? (
          <>
          <NavItem href="" onClick={() => setMenuOpen(false)}>{email}</NavItem>
          <NavItem href="" onClick={() => {
            setMenuOpen(false);
            localStorage.removeItem("token");
            setEmail("");
            window.location.href = "/login"; // Redirect to login page after logout
            }
          }>LogOut</NavItem>
          </>
          ):(
          <>
            <NavItem href="/pricing" onClick={() => setMenuOpen(false)}>Register</NavItem>
            <NavItem href="/login" onClick={() => setMenuOpen(false)}>Login</NavItem>
          </>)
        }
        <NavItem href=""><ThemeToggle /></NavItem>

      </ul>
    </nav>
  );
}