/**
 * Product entity — pure domain model.
 * No framework dependencies. Single source of truth for the Product shape.
 * All properties are readonly to enforce immutability at the domain layer.
 */

export interface ProductRating {
  readonly rate: number;
  readonly count: number;
}

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly image: string;
  readonly rating: ProductRating;
}

/** Type-safe alias — prevents passing arbitrary numbers where a ProductId is expected */
export type ProductId = Product['id'];

/** Category names returned by the FakeStore API (e.g. "men's clothing") */
export type Category = string;
