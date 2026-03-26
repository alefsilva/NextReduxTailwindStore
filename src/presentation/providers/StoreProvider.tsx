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

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/infra/store/store';
import { hydrateCart } from '@/infra/store/cartSlice';
import type { AppStore } from '@/infra/store/store';
import type { CartItem } from '@/core/domain/entities/CartItem';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = store;
  }

  /**
   * Hydrate cart from localStorage AFTER the first render.
   *
   * useEffect is client-only and runs post-hydration, so the initial
   * server HTML (empty cart) always matches the first client render.
   * React then performs a normal re-render with the real cart data.
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        const parsed = JSON.parse(raw) as { items: CartItem[] };
        if (Array.isArray(parsed.items)) {
          storeRef.current!.dispatch(hydrateCart(parsed.items));
        }
      }
    } catch {
      // Ignore corrupt or unavailable localStorage data
    }
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
