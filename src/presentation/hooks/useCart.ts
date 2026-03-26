'use client';

import { useAppDispatch, useAppSelector } from '@/infra/store/hooks';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
} from '@/infra/store/cartSlice';
import type { Product, ProductId } from '@/core/domain/entities/Product';

/**
 * useCart — encapsulates all cart state and actions.
 * Use this hook in any Client Component instead of reaching directly
 * into Redux, keeping components decoupled from the store shape.
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  return {
    items,
    itemCount,
    total,
    addItem: (product: Product) => dispatch(addItem(product)),
    removeItem: (id: ProductId) => dispatch(removeItem(id)),
    updateQuantity: (id: ProductId, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
}
