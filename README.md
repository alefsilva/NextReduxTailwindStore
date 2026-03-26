# NextReduxTailwindStore

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?logo=github)](https://alefsilva.github.io/NextReduxTailwindStore/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

> A production-grade e-commerce storefront built as a senior technical challenge.
> Demonstrates clean architecture, SSG with client-side resilience, and advanced Redux patterns.

**[→ Live Demo](https://alefsilva.github.io/NextReduxTailwindStore/)**

---

## 📋 Project Overview

NextReduxTailwindStore is a fully static e-commerce application deployed to GitHub Pages. It consumes the [FakeStore API](https://fakestoreapi.com/) and is architected to maximize performance, SEO, and developer scalability from day one.

The core engineering challenge was building a **zero-runtime-server** storefront — every page is pre-rendered as static HTML at build time (`output: 'export'`) while preserving full interactivity (cart, category filters, real-time API data) through strategic use of React Server Components, Client Components, and RTK Query.

**Key metrics targeted:**
- All product pages pre-rendered as static HTML → optimal TTFB and LCP
- Client-side data recovery when the API is unavailable during CI builds
- Zero hydration mismatches — cart state restored post-hydration to avoid server/client divergence
- Cart persistence that survives page refresh, new tabs, and browser restarts

---

## 🛠️ Tech Stack

| Technology | Version | Rationale |
|---|---|---|
| **Next.js App Router** | 16 | SSG with `output: 'export'`, React Server Components, per-page `generateMetadata` for SEO |
| **React** | 19 | Concurrent Mode, `useRef` singleton pattern for store stability in StrictMode |
| **TypeScript** | 5 | Strict typing across all layers — domain entities, Redux state, API contracts |
| **Redux Toolkit** | 2 | Predictable state for cart; RTK Query for API caching and async state management |
| **RTK Query** | (via RTK) | Eliminates boilerplate for loading/error states; 5-minute client-side cache via `keepUnusedDataFor` |
| **Tailwind CSS** | 3 | Design token system (color, typography, spacing, shadow scales) for consistent UI at speed |
| **Lucide React** | 0.468 | Tree-shakeable icon library — zero unused icons in the bundle |

---

## 🏛️ Architectural Decisions

### 1. Clean Architecture — Three-Layer Separation

The codebase enforces strict dependency rules: outer layers depend on inner layers, never the reverse.

```
core/          ← Domain logic — no framework dependencies
infra/         ← Implementation details (API, Redux store)
presentation/  ← UI components, hooks, providers
```

**`core/domain/`** owns the business entities (`Product`, `CartItem`) and the repository interface (`IProductRepository`). These are pure TypeScript — no Next.js, no Redux, no React imports. If the entire infrastructure were replaced (e.g., swap RTK Query for SWR, swap FakeStore for a real backend), the domain layer would remain untouched.

**`infra/`** implements the repository contract via RTK Query (`productsApi`) and owns Redux store configuration and slice logic. It has no knowledge of React component structure.

**`presentation/`** consumes infrastructure through typed hooks (`useCart`, `useGetProductsQuery`) and renders UI. Components have no direct access to the store or API — all state flows through hooks.

---

### 2. Static Site Generation with Client-Side Resilience

All 20 product pages are pre-rendered at build time via `generateStaticParams`. The build runs in GitHub Actions, where `fakestoreapi.com` rate-limits individual product endpoints under concurrent load.

**The problem:** A naïve implementation makes 40+ individual `/products/{id}` requests in parallel — all get rate-limited (403/429), every page calls `notFound()`, and the deployed site has 404 HTML for every product.

**The solution — two layers of resilience:**

**Layer 1 — Single cached fetch:** Both `generateMetadata` and `ProductPage` call `GET /products` (all products at once) instead of individual endpoints. Next.js Data Cache deduplicates this across all 20 concurrent page renders — only **one real API call** is made during the entire build.

**Layer 2 — Client-side hydration fallback:** If the build-time fetch fails entirely, `ProductPage` passes `product={null}` to `ProductDetail` instead of calling `notFound()`. The static HTML shell is still generated. On the user's browser — where the API is unrestricted — `ProductDetail` detects the null prop and fires `useGetProductByIdQuery` automatically.

```
Build (CI):    fetch /products → Data Cache hit for all 20 pages
               If API down → HTML shell generated (no notFound(), no 404)

Runtime:       product prop null? → useGetProductByIdQuery fires → real data loaded
```

This ensures the deployed site **always has a valid page structure**, regardless of API availability at build time.

---

### 3. RTK Query — Cache-First Data Layer

RTK Query manages all server-state. Its `keepUnusedDataFor: 300` (5 minutes) means navigating between the product list and a product detail page never triggers redundant network requests — data is served from the in-memory cache.

| Endpoint | Used by |
|---|---|
| `getProducts` | `ProductGrid` — full product list |
| `getProductById` | `ProductDetail` — client-side recovery fallback |
| `getCategories` | `CategoryFilter` — dynamic category tabs |
| `getProductsByCategory` | `ProductGrid` — filtered product view |

`providesTags` is declared on every query as forward-looking SOLID practice: if write operations (order placement, wishlist) are added later, cache invalidation via `invalidatesTags` is already wired.

---

### 4. Atomic Design Component System

Components follow Atomic Design with three layers of abstraction:

| Layer | Components | Responsibility |
|---|---|---|
| **Atoms** | `Badge`, `Button`, `Rating`, `Spinner` | Single-responsibility primitives; no business logic, no Redux/RTK Query dependencies |
| **Molecules** | `ProductCard`, `CategoryFilter` | Composites that combine atoms around a single interaction concern |
| **Organisms** | `Header`, `CartDrawer`, `ProductGrid`, `ProductDetail`, `ProductsSection` | Feature-complete sections that own state and orchestrate molecules |

Atoms have zero external state dependencies — they're trivially testable and reusable across any context.

---

### 5. StoreProvider — Minimal Client Component Boundary

`react-redux <Provider>` requires browser APIs (`Context`, `useRef`), which forces it to be a Client Component. Marking `layout.tsx` as `'use client'` would convert the **entire application tree** to client rendering, losing RSC streaming, SEO, and TTFB benefits.

`StoreProvider` isolates this boundary to the smallest possible scope. Server Components passed as `{children}` are pre-serialized as RSC payloads before reaching the client boundary — their SEO content and streaming benefits are fully preserved.

---

### 6. Cart Persistence — Race Condition Fix

A non-obvious race condition existed in a naïve `store.subscribe()` → `localStorage` pattern:

**Root cause:** React runs `useEffect` hooks **bottom-up** (children before parents). A global `store.subscribe()` registered at module load in `store.ts` fires the moment RTK Query's `useEffect` dispatches its first `pending` action — which happens *before* `StoreProvider`'s `useEffect` can restore the cart. The empty initial Redux state overwrites saved localStorage data, losing all items on page refresh.

**Fix:** The subscribe for localStorage writes is registered **inside** `StoreProvider`'s `useEffect`, only **after** `hydrateCart` has been dispatched:

```typescript
useEffect(() => {
  // Step 1 — Restore first
  store.dispatch(hydrateCart(savedItems));

  // Step 2 — Then start persisting (never before)
  const unsubscribe = store.subscribe(() => {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart));
  });
  return unsubscribe; // cleanup on unmount
}, []);
```

---

## ⚡ Performance & UX

### Loading States
Every async boundary has a `<Spinner />`. `ProductGrid` shows it while RTK Query fetches. `ProductDetail` shows it when falling back to client-side recovery. No empty or layout-shifting blank screens.

### Image Optimization
`next/image` is used throughout with explicit `sizes` for responsive image selection and `priority` on the above-the-fold product detail image (LCP element):

```tsx
// ProductCard — grid thumbnail
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"

// ProductDetail — hero image
sizes="(max-width: 768px) 100vw, 50vw"
priority  // ← LCP image, preloaded in <head>
```

`unoptimized: true` is required for `output: 'export'` — there is no Next.js server to process images on the fly.

### Core Web Vitals

| Metric | Strategy |
|---|---|
| **LCP** | Product detail image marked `priority` — preloaded via `<link rel="preload">` |
| **CLS** | All image containers have explicit aspect ratios (`aspect-square`, `h-56`) — zero layout shift |
| **FID / INP** | Cart interactions are synchronous Redux dispatches — no async delay on user action |
| **TTFB** | Static HTML served directly from GitHub Pages CDN — no server compute path |

### Design Token System
`tailwind.config.ts` defines a full token system — color scales (`brand`, `neutral`, semantic colors), typographic scales (`display-lg` → `caption`), shadow tokens (`card`, `card-hover`, `modal`), and transition durations. All components reference tokens, never raw values. A complete theme change requires editing a single config file.

---

## 🚀 Setup & Deployment

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
# Clone the repository
git clone https://github.com/alefsilva/NextReduxTailwindStore.git
cd NextReduxTailwindStore

# Install dependencies
npm install

# Start dev server (basePath disabled in development)
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
# Generate static export
npm run build
# Output: ./out/

# Preview the static build locally (mirrors GitHub Pages path)
npx serve out -p 3001
# → http://localhost:3001/NextReduxTailwindStore/
```

### CI/CD — GitHub Actions → GitHub Pages

Every push to `master` triggers the automated deploy:

```
push to master
  └── build job
        ├── actions/checkout@v4
        ├── actions/setup-node@v4  (Node.js 24)
        ├── npm ci
        ├── npm run build               → ./out/
        ├── touch ./out/.nojekyll       ← disables Jekyll; required for _next/ assets
        └── actions/upload-pages-artifact@v3
  └── deploy job
        └── actions/deploy-pages@v4
              → https://alefsilva.github.io/NextReduxTailwindStore/
```

> **Note:** Repository must have `Settings → Pages → Source` set to **GitHub Actions** (not "Deploy from a branch").

> **Why `.nojekyll`?** GitHub Pages runs Jekyll by default, which silently ignores directories prefixed with `_`. Without this file, the entire `_next/` directory (all JS/CSS bundles) is excluded from the deployment.

---

## 📁 Folder Structure

```
NextReduxTailwindStore/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD pipeline
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout — Server Component
│   │   ├── page.tsx                    # Home page — Server Component
│   │   ├── globals.css
│   │   └── product/
│   │       └── [id]/
│   │           └── page.tsx            # SSG product pages + generateStaticParams
│   │
│   ├── core/                           # Domain layer — zero framework dependencies
│   │   └── domain/
│   │       ├── entities/
│   │       │   ├── Product.ts          # Product, ProductId, Category types
│   │       │   └── CartItem.ts
│   │       └── interfaces/
│   │           └── IProductRepository.ts
│   │
│   ├── infra/                          # Infrastructure layer
│   │   ├── api/
│   │   │   └── productsApi.ts          # RTK Query API slice (4 endpoints)
│   │   └── store/
│   │       ├── store.ts                # Redux store configuration
│   │       ├── cartSlice.ts            # Cart reducer + memoized selectors
│   │       └── hooks.ts                # Typed useAppDispatch / useAppSelector
│   │
│   └── presentation/                   # UI layer
│       ├── components/
│       │   ├── atoms/                  # Single-responsibility primitives
│       │   │   ├── Badge.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Rating.tsx
│       │   │   └── Spinner.tsx
│       │   ├── molecules/              # Composite components
│       │   │   ├── CategoryFilter.tsx
│       │   │   └── ProductCard.tsx
│       │   └── organisms/             # Feature-complete sections
│       │       ├── Header.tsx
│       │       ├── CartDrawer.tsx
│       │       ├── ProductsSection.tsx
│       │       ├── ProductGrid.tsx
│       │       └── ProductDetail.tsx
│       ├── hooks/
│       │   └── useCart.ts              # Cart actions abstraction
│       └── providers/
│           └── StoreProvider.tsx       # Redux client boundary + localStorage sync
│
├── next.config.mjs                     # SSG + basePath configuration
├── tailwind.config.ts                  # Design token system
└── tsconfig.json
```

---

## 📄 License

MIT
