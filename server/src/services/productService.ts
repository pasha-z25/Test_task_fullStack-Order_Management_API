import { AppDataSource } from '@/db';
import { Product } from '@/db/entities';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    const productRepository = AppDataSource.getRepository(Product);

    return await productRepository.find();
  }
}
