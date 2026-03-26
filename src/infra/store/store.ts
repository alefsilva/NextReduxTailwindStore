import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../api/productsApi';
import { cartSlice } from './cartSlice';

/**
 * Central Redux store.
 * RTK Query middleware enables caching, invalidation, polling, and
 * automatic lifecycle management of API requests.
 */
export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Always derive types from the store — never hardcode them
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
