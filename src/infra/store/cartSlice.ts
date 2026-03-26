import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductId } from '@/core/domain/entities/Product';
import type { CartItem } from '@/core/domain/entities/CartItem';
import type { RootState } from './store';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Adds a product to the cart.
     * If the product already exists, increments its quantity by 1.
     */
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },

    /**
     * Removes a product from the cart entirely.
     */
    removeItem(state, action: PayloadAction<ProductId>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },

    /**
     * Sets an explicit quantity for a cart item.
     * Removes the item if quantity reaches 0.
     */
    updateQuantity(
      state,
      action: PayloadAction<{ id: ProductId; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== id);
        return;
      }
      const existing = state.items.find((item) => item.product.id === id);
      if (existing) {
        existing.quantity = quantity;
      }
    },

    /** Empties the cart. */
    clearCart(state) {
      state.items = [];
    },

    /**
     * Replaces the cart state with data loaded from localStorage.
     * Must only be dispatched from a useEffect (client-only, post-hydration)
     * to avoid server/client HTML mismatch.
     */
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, hydrateCart } =
  cartSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cart) => cart.items,
);

/** Total number of individual units in the cart (sum of all quantities). */
export const selectCartItemCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

/** Total price of all items in the cart. */
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0),
);
