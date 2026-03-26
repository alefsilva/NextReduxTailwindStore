'use client';

/**
 * StoreProvider — isolated Client Component boundary.
 *
 * Why this pattern matters:
 * - react-redux <Provider> needs browser APIs (Context, useRef), so it must
 *   be a Client Component.
 * - Marking layout.tsx as 'use client' would convert the ENTIRE app subtree
 *   to client-side, losing RSC streaming, SEO, and TTFB benefits.
 * - By isolating the boundary here, layout.tsx stays a pure Server Component.
 * - Server Components passed as {children} are pre-serialized by React as RSC
 *   payloads before reaching this boundary — so SEO and streaming are preserved.
 *
 * useRef pattern:
 * - Ensures a single store instance across re-renders in Concurrent Mode /
 *   React StrictMode (which double-invokes components during development).
 */

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/infra/store/store';
import type { AppStore } from '@/infra/store/store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
