'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


interface BasicRegisterProps {
  isPremium: boolean;
}

export default function BasicRegister({ isPremium }: BasicRegisterProps) {

  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(password);

  const handleRegister = async () => {
    setErrorMsg("");
    if (!userName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMsg("Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setStatus("Registering...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password, isPremium }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Registration successful! Please check your email to activate your account.")
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        if (isPremium) {
          localStorage.setItem("PremiumRegisteringInProgress", "true"); // Flag to indicate premium registration
          localStorage.setItem("registeringEmail", email); // Store email for payment page
          setTimeout(() => {
            router.push("/payment");
          }, 100); // 100ms is enough to ensure write is flushed

        } else{
          // router.push("registerSuccess");
        } 
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Registration failed. Please try again.");
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
        "bg-gray-50 dark:bg-gray-950"
      )}
    >
      <h1 className="text-xl font-bold mb-4">Register ({isPremium ? "Pro Tier" : "Free Tier"})</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div className="mb-4">
          <Label htmlFor="userName" className="text-gray-700 dark:text-white">User Name</Label>
          <Input
            id="userName"
            type="userName"
            autoComplete="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 bg-white text-black dark:bg-gray-800 dark:text-white"
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 bg-white text-black dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-white">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 bg-white text-black dark:bg-gray-800 dark:text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-1.5 mt-2 text-white cursor-pointer hover:brightness-110 transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: 'oklch(59.2% 0.249 0.584)' }}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>



      {errorMsg ? (
        <p className="mt-4 text-sm text-red-500">{errorMsg}</p>
      ) : (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{status}</p>
      )}
    </div>
  );
}
