import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Browse our complete product catalog.',
};

/**
 * Home page — Server Component.
 *
 * With `output: 'export'` this generates /index.html at build time.
 * Client Components (ProductGrid, CategoryFilter) will be imported here
 * and hydrated on the client side with Redux/RTK Query state.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* TODO: <Header /> */}

      <section aria-labelledby="products-heading">
        <h1
          id="products-heading"
          className="mb-8 text-heading-lg text-neutral-900"
        >
          All Products
        </h1>

        {/* TODO: <CategoryFilter /> */}
        {/* TODO: <ProductGrid /> */}

        <p className="text-body-md text-neutral-500">
          Product catalog — coming next.
        </p>
      </section>
    </main>
  );
}
