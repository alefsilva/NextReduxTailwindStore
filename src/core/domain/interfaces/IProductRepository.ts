import type { Product, ProductId, Category } from '../entities/Product';

/**
 * Repository interface — contract for product data access.
 *
 * Following the Dependency Inversion Principle: high-level modules (use cases)
 * depend on this abstraction, not on any concrete implementation (RTK Query,
 * REST client, mock, etc.). Swapping the data source requires only a new
 * class implementing this interface.
 */
export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: ProductId): Promise<Product>;
  getCategories(): Promise<Category[]>;
  getByCategory(category: Category): Promise<Product[]>;
}
