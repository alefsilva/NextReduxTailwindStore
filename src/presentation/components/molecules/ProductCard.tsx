import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/core/domain/entities/Product';
import { Badge } from '@/presentation/components/atoms/Badge';
import { Rating } from '@/presentation/components/atoms/Rating';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-shadow duration-normal hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      aria-label={product.title}
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-50 p-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-slow group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge label={product.category} />

        <h2 className="line-clamp-2 text-body-sm font-medium text-neutral-800 group-hover:text-brand-600">
          {product.title}
        </h2>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-heading-sm text-neutral-900">
            ${product.price.toFixed(2)}
          </span>
          <Rating rate={product.rating.rate} count={product.rating.count} />
        </div>
      </div>
    </Link>
  );
}
