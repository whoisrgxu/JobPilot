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
    </div>

  );
}
