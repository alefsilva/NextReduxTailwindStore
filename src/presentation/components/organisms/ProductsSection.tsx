'use client';

import { useState } from 'react';
import { CategoryFilter } from '@/presentation/components/molecules/CategoryFilter';
import { ProductGrid } from '@/presentation/components/organisms/ProductGrid';

/**
 * ProductsSection — Client Component boundary.
 *
 * Owns the `selectedCategory` state so that page.tsx can remain a
 * Server Component. CategoryFilter and ProductGrid communicate through
 * this shared parent instead of reaching into the global Redux store,
 * keeping local UI state local (React best practice).
 */
export function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section aria-labelledby="products-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          id="products-heading"
          className="text-heading-lg text-neutral-900"
        >
          {selectedCategory ? (
            <span className="capitalize">{selectedCategory}</span>
          ) : (
            'All Products'
          )}
        </h1>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <ProductGrid selectedCategory={selectedCategory} />
    </section>
  );
}
