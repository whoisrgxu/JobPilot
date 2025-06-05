"use client";
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import { useState } from "react";

export default function Register() {

  const [menuOpen] = useAtom(menuOpenAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [registerationFailMsg, setRegistrationFailMsg] = useState("");

  // Helper function to validate email format
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  // Helper function to validate password strength
  const isValidPassword = (password: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number, and one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    return re.test(password);
  };

  const handleRegister = async () => {
    setRegistrationFailMsg("");
    if (!email || !password) {
      setRegistrationFailMsg("Please fill in all fields.");
      return;
    }
    // Validate email and password
    if(isValidEmail(email) === false) {
      setRegistrationFailMsg("Please enter a valid email address.");
      return;
    }
    if(isValidPassword(password) === false) {
      setRegistrationFailMsg("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.");
      return;
    }
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
    <div className={`max-w-md mx-auto mt-40 p-6 md:border shadow rounded ${menuOpen ? "hidden" : ""}`}>
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <input
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
          type="submit"
          className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        >
          Register
        </button>
      </form>
      {registerationFailMsg.length > 0 ?
        (
          <p className="mt-4 text-sm text-red-500">
            {registerationFailMsg}
          </p>
        ) : (
          <p className="mt-4 text-sm text-gray-700">
            {status}
          </p>
        )
      }
    </div>
  );
}
