import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/core/domain/entities/Product';
import { Header } from '@/presentation/components/organisms/Header';
import { ProductDetail } from '@/presentation/components/organisms/ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Shared headers for all build-time fetch calls.
 * Node.js fetch omits User-Agent by default; fakestoreapi.com blocks
 * requests from bots/CI environments with 403 without this header.
 */
const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; NextReduxTailwindStore/1.0)',
};

/**
 * generateStaticParams — mandatory for dynamic routes with `output: 'export'`.
 *
 * Fetches all product IDs at build time so Next.js can pre-generate a
 * static HTML file for each product. Uses a try/catch + fallback so a
 * transient API error (403, 5xx, network) never breaks the CI build:
 * the fallback generates the 20 known fakestoreapi.com product pages.
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products', {
      headers: FETCH_HEADERS,
    });

    if (response.ok) {
      const products: Array<{ id: number }> = await response.json();
      return products.map(({ id }) => ({ id: String(id) }));
    }
  } catch {
    // Network error — fall through to hardcoded fallback
  }

  // Fallback: fakestoreapi.com always has exactly 20 products (IDs 1–20)
  return Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
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
  const response = await fetch('https://fakestoreapi.com/products', {
    headers: FETCH_HEADERS,
  });

  if (!response.ok) {
    return { title: 'Product Not Found' };
  }

  const products: Product[] = await response.json();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return { title: 'Product Not Found' };
  }

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
  const response = await fetch('https://fakestoreapi.com/products', {
    headers: FETCH_HEADERS,
  });

  if (!response.ok) {
    notFound();
  }

  const products: Product[] = await response.json();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductDetail product={product} />
      </main>
    </>
  );
}
