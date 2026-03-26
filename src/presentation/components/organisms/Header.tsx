import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-heading-sm font-semibold text-neutral-900 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          aria-label="NextReduxTailwindStore — Home"
        >
          <ShoppingBag size={24} className="text-brand-600" aria-hidden="true" />
          <span>NRTStore</span>
        </Link>
      </div>
    </header>
  );
}
