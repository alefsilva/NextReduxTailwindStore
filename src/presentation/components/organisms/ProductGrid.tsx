'use client';

import { AlertCircle } from 'lucide-react';
import {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
} from '@/infra/api/productsApi';
import { ProductCard } from '@/presentation/components/molecules/ProductCard';
import { Spinner } from '@/presentation/components/atoms/Spinner';

interface ProductGridProps {
  selectedCategory: string | null;
}

export function ProductGrid({ selectedCategory }: ProductGridProps) {
  const allProducts = useGetProductsQuery(undefined, {
    skip: selectedCategory !== null,
  });
  const byCategory = useGetProductsByCategoryQuery(selectedCategory ?? '', {
    skip: selectedCategory === null,
  });

  const { data, isLoading, isError } = selectedCategory === null
    ? allProducts
    : byCategory;

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-error">
        <AlertCircle size={32} aria-hidden="true" />
        <p className="text-body-md">Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-body-md text-neutral-500">No products found.</p>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Product list"
    >
      {data.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
