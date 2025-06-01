"use client";
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import { useState } from "react";

export default function Register() {

  const [menuOpen] = useAtom(menuOpenAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    setStatus("Registering...");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setStatus("Registration successful!");
        setEmail("");
        setPassword("");
        // Optionally redirect to login or generate page
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Registration failed. Please try again.");
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 border shadow rounded ${menuOpen ? "hidden" : ""}`}>
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        onClick={handleRegister}
      >
        Register
      </button>
      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </div>
  );
}
