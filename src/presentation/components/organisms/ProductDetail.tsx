'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronLeft, Check } from 'lucide-react';
import type { Product } from '@/core/domain/entities/Product';
import { Badge } from '@/presentation/components/atoms/Badge';
import { Rating } from '@/presentation/components/atoms/Rating';
import { Button } from '@/presentation/components/atoms/Button';
import { Spinner } from '@/presentation/components/atoms/Spinner';
import { useCart } from '@/presentation/hooks/useCart';
import { useGetProductByIdQuery } from '@/infra/api/productsApi';

interface ProductDetailProps {
  product: Product | null;
  productId: number;
}

export function ProductDetail({ product: initialProduct, productId }: ProductDetailProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  /**
   * Skip the query when the Server Component already provided product data
   * at build time. Only fires in the browser when the build-time fetch
   * failed (API rate-limited in CI) — transparently recovers with real data.
   */
  const { data: fetchedProduct, isLoading } = useGetProductByIdQuery(productId, {
    skip: initialProduct !== null,
  });

  const product = initialProduct ?? fetchedProduct ?? null;

  if (isLoading || !product) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  function handleAddToCart() {
    addItem(product!);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-body-sm text-neutral-500 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 p-8">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <Badge label={product.category} />

          <h1 className="text-heading-lg text-neutral-900">{product.title}</h1>

          <div className="flex items-center gap-4">
            <span className="text-display-sm text-brand-600">
              ${product.price.toFixed(2)}
            </span>
            <Rating
              rate={product.rating.rate}
              count={product.rating.count}
              showCount
            />
          </div>

          <p className="text-body-md leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <div className="mt-auto pt-4">
            <Button
              fullWidth
              onClick={handleAddToCart}
              variant={added ? 'secondary' : 'primary'}
              aria-label={added ? 'Added to cart' : 'Add to cart'}
            >
              {added ? (
                <>
                  <Check size={18} aria-hidden="true" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} aria-hidden="true" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
