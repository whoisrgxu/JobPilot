// src/components/InactivityWrapper.tsx
'use client';

import { ReactNode } from 'react';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function InactivityWrapper({ children }: { children: ReactNode }) {
  useInactivityLogout(); // logout after inactivity
  return <>{children}</>;
}
