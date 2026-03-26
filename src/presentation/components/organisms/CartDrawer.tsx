'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/presentation/hooks/useCart';
import { Button } from '@/presentation/components/atoms/Button';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, removeItem, updateQuantity } = useCart();

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-normal ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-modal transition-transform duration-slow ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-heading-sm text-neutral-900">
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 text-body-sm font-normal text-neutral-500">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p className="text-body-md">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3"
                >
                  {/* Product image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="line-clamp-2 text-body-sm font-medium text-neutral-800">
                      {product.title}
                    </p>
                    <p className="text-body-sm font-semibold text-brand-600">
                      ${(product.price * quantity).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-l-lg text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          aria-label={`Quantity: ${quantity}`}
                          className="w-8 text-center text-body-sm font-medium text-neutral-900"
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-r-lg text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.title}`}
                        className="ml-auto rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-error-light hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-body-md font-medium text-neutral-700">Total</span>
              <span className="text-heading-sm text-neutral-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button fullWidth>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
