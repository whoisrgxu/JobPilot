// src/components/ClientHydrate.tsx
'use client';

import { useAuthHydration } from '@/hooks/useAuthHydration';

export default function ClientHydrate() {
  useAuthHydration();
  return null;
}
