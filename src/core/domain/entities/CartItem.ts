import type { Product } from './Product';

/**
 * CartItem entity — represents a product in the shopping cart.
 * Composition over inheritance: wraps Product with an added quantity.
 */
export interface CartItem {
  readonly product: Product;
  quantity: number;
}
