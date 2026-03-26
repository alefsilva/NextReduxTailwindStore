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
 *
 * localStorage strategy — why subscribe lives here and not in store.ts:
 * - React runs useEffect bottom-up (children before parents).
 * - A global store.subscribe() in store.ts fires as soon as RTK Query's
 *   child useEffect dispatches its first "pending" action, overwriting
 *   localStorage with an empty cart before this provider can restore it.
 * - By setting up the subscribe INSIDE this useEffect (after hydrateCart),
 *   writes only begin once the cart has been fully restored.
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

  useEffect(() => {
    /**
     * Step 1 — Restore cart from localStorage.
     *
     * useEffect is client-only and runs post-hydration, so the initial
     * server HTML (empty cart) always matches the first client render.
     * React then performs a normal re-render with the real cart data.
     */
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

    /**
     * Step 2 — Persist cart on every subsequent state change.
     *
     * Subscribe is set up AFTER hydrateCart so the first write to
     * localStorage already contains the restored items, not an empty array.
     * The unsubscribe is returned for cleanup on unmount.
     */
    const unsubscribe = storeRef.current!.subscribe(() => {
      try {
        localStorage.setItem(
          'cart',
          JSON.stringify(storeRef.current!.getState().cart),
        );
      } catch {
        // Silently ignore QuotaExceededError (private browsing with full quota)
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
