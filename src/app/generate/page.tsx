// app/generate/page.tsx
export const dynamic = 'force-dynamic'; // or: export const revalidate = 0

import { Suspense } from 'react';
import GenerateClient from './GenerateClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading…</div>}>
      <GenerateClient />
    </Suspense>
  );
}