import type { Metadata } from 'next';
import { Header } from '@/presentation/components/organisms/Header';
import { ProductsSection } from '@/presentation/components/organisms/ProductsSection';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Browse our complete product catalog.',
};

/**
 * Home page — Server Component.
 *
 * With `output: 'export'` this generates /index.html at build time.
 * ProductsSection is a Client Component that holds the selectedCategory
 * state and renders CategoryFilter + ProductGrid, keeping this page
 * as a pure Server Component (no 'use client' needed here).
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductsSection />
      </main>
    </>
  );
}
