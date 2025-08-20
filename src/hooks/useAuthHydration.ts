// src/hooks/useAuthHydration.ts
'use client';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/store/authAtom';

export function useAuthHydration() {
  const setAuth = useSetAtom(authAtom);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth({ token, userName: payload.userName, email: payload.email });
      } catch {
        // invalid token
        localStorage.removeItem('token');
        setAuth({ token: '', email: '', userName: '' });
      }
    }
  }, [setAuth]);
}
