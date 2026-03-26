import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/presentation/providers/StoreProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'NextReduxTailwindStore',
    template: '%s | NextReduxTailwindStore',
  },
  description:
    'A modern e-commerce built with Next.js App Router, Redux Toolkit, and Tailwind CSS.',
  metadataBase: new URL(
    'https://your-username.github.io/NextReduxTailwindStore',
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NextReduxTailwindStore',
  },
};

/**
 * Root Layout — Server Component.
 *
 * StoreProvider is a Client Component but receives Server Component children
 * because React serializes RSC payloads before passing them through the client
 * boundary. This preserves RSC streaming, SEO, and TTFB benefits.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
