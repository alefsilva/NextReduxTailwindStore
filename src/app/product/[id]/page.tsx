import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/core/domain/entities/Product';
import { Header } from '@/presentation/components/organisms/Header';
import { ProductDetail } from '@/presentation/components/organisms/ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * generateStaticParams — mandatory for dynamic routes with `output: 'export'`.
 *
 * At build time, Next.js calls this function, fetches all products, and
 * pre-generates a static HTML file for each product ID.
 * Without this, `next build` hard-fails on dynamic routes in static export mode.
 *
 * Note: This fetch runs in Node.js at BUILD TIME only. RTK Query hooks cannot
 * be used here — they are React hooks and require a render context.
 * Next.js automatically deduplicates identical fetch calls across
 * generateStaticParams, generateMetadata, and the page component.
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const response = await fetch('https://fakestoreapi.com/products');

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products for static params: ${response.status}`,
    );
  }

  const products: Array<{ id: number }> = await response.json();

  return products.map((product) => ({ id: String(product.id) }));
}

/**
 * Per-page metadata generated at build time.
 * Each product page gets its own unique <title> and <meta description>
 * baked into the static HTML — a significant SSG SEO advantage.
 */
export async function generateMetadata(
  { params }: ProductPageProps,
): Promise<Metadata> {
  const { id } = await params;
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!response.ok) {
    return { title: 'Product Not Found' };
  }

  const product: Pick<Product, 'title' | 'description' | 'image'> =
    await response.json();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

/**
 * Product detail page — Server Component.
 *
 * Fetches product data at BUILD TIME and passes it as props to the
 * ProductDetail organism (Client Component for cart/wishlist interactivity).
 * With `output: 'export'`, generates /product/[id]/index.html for each ID.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!response.ok) {
    notFound();
  }

  const product: Product = await response.json();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductDetail product={product} />
      </main>
    </>
  );
}
