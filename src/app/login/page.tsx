'use client';
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import { useState } from "react";

export default function Login() {

  const [menuOpen] = useAtom(menuOpenAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async () => {
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
        setStatus("Login successful!");
        // Redirect to the generate page
        window.location.href = "/generate";
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Login failed. Please try again.");
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-40 p-6 md:border shadow rounded ${menuOpen ? "hidden" : ""}`}>
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        onClick={handleLogin}
      >
        Login
      </button>
      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </div>
  );
}
