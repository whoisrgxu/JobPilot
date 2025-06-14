'use client';
import { useMemo } from "react";

export function useUser() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("payload: ", payload);
      return payload; // contains email, sub (id), role, etc.
    } catch {
      return null;
    }
  }, [token]);
}
