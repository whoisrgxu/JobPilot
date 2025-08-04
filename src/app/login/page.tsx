'use client';
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" // optional: helps merge classNames
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/store/authAtom';
import { signIn } from "next-auth/react";


export default function Login() {

  const router = useRouter();

  const [menuOpen] = useAtom(menuOpenAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useSetAtom(authAtom); // initialize setter


  const handleLogin = async () => {

    setIsLoading(true);
    setStatus("Logging in...");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT in localStorage (or cookie if preferred)
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setAuth({ token: data.token, email: payload.email }); // set global state
        setStatus("Login successful!");
        // Redirect to the generate page
        router.push("/generate");
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "border md:border md:border-gray-300 dark:md:border-gray-500 rounded-2xl shadow-md",
        "max-w-[28rem] mx-auto p-6",
        "mt-20 md:mt-40",
        "bg-gray-50 dark:bg-gray-950", 
        menuOpen && "hidden"
      )}
    >
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <div className="mb-4">
        <Label htmlFor="email" className="text-gray-700 dark:text-white">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 bg-white text-black dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="password" className="text-gray-700 dark:text-white">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 bg-white text-black dark:bg-gray-800 dark:text-white"
        />
      </div>

      <Button
        className="w-full py-1.5 mt-2 text-white cursor-pointer hover:brightness-110 transition-colors"
        style={{ backgroundColor: 'oklch(59.2% 0.249 0.584)' }}
        onClick={handleLogin}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </Button>

      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{status}</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
        Don&apos;t have an account?{" "}
        <a
          href="/pricing"
          className="underline text-pink-600 hover:text-pink-500 dark:hover:text-pink-400"
        >
          Register here
        </a>
      </p>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        <span className="mx-3 text-gray-500 dark:text-gray-400 text-xs">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
        onClick={() => signIn("google", {
          prompt: "consent",
        })}
        disabled={isLoading}
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48">
          <g>
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.4 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 19.5-8.5 19.5-19.5 0-1.3-.1-2.5-.3-3.5z"/>
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 17.1 19.4 14.5 24 14.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4.5 24 4.5c-7.2 0-13.3 4.1-16.7 10.2z"/>
        <path fill="#FBBC05" d="M24 45.5c5.6 0 10.5-1.9 14.3-5.2l-6.6-5.4c-2.1 1.4-4.8 2.1-7.7 2.1-6.1 0-11.2-4.1-13-9.6l-7 5.4C7.1 41.1 14.9 45.5 24 45.5z"/>
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-6.1 0-11.2-4.1-13-9.6l-7 5.4C7.1 41.1 14.9 45.5 24 45.5c10.5 0 19.5-8.5 19.5-19.5 0-1.3-.1-2.5-.3-3.5z"/>
          </g>
        </svg>
        Continue with Google
      </Button>

    </div>

  );
}
