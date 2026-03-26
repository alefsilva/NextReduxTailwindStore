import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductId, Category } from '@/core/domain/entities/Product';

/**
 * RTK Query API slice for the FakeStore API.
 * Fulfills the IProductRepository contract through generated React hooks.
 *
 * keepUnusedDataFor: 300s — increases the default 60s cache for a better UX
 * on a SSG site where server-side re-fetching doesn't exist.
 *
 * providesTags on every query is a forward-looking SOLID practice: it costs
 * nothing for this read-only store but makes the codebase immediately ready
 * if write operations (cart, wishlist) are added via invalidatesTags.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fakestoreapi.com',
  }),
  keepUnusedDataFor: 300,
  tagTypes: ['Product', 'Category'],
  endpoints: (builder) => ({

    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    getProductById: builder.query<Product, ProductId>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product' as const, id }],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories',
      providesTags: [{ type: 'Category' as const, id: 'LIST' }],
    }),

    getProductsByCategory: builder.query<Product[], Category>({
      query: (category) =>
        `/products/category/${encodeURIComponent(category)}`,
      providesTags: (result, _error, category) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Category' as const, id: category },
            ]
          : [{ type: 'Category' as const, id: category }],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
