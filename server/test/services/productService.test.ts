import { Product } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { ProductService } from '@/services/productService'; // Зміни шлях до твого файлу
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let productRepository: Repository<Product>;
  let productService: ProductService;

  beforeEach(async () => {
    productRepository = getRepository(Product);
    productService = new ProductService();
  });

  describe('getAllProducts', () => {
    it('should return a list of products when products exist', async () => {
      const product1 = productRepository.create({
        id: randomUUID(),
        name: 'Laptop',
        price: 1000,
        stock: 5,
      });
      const product2 = productRepository.create({
        id: randomUUID(),
        name: 'Mouse',
        price: 20,
        stock: 50,
      });
      await productRepository.save([product1, product2]);

      const products = await productService.getAllProducts();
      // const normalizedProducts = products.map((product) => ({
      //   ...product,
      //   price: Number(product.price),
      // }));

      expect(products).toHaveLength(2);
      expect(products).toContainEqual(
        expect.objectContaining({ name: 'Laptop', price: '1000', stock: 5 })
      );
      expect(products).toContainEqual(
        expect.objectContaining({ name: 'Mouse', price: '20', stock: 50 })
      );
    });

    it('should return an empty array when no products exist', async () => {
      const products = await productService.getAllProducts();

      expect(products).toEqual([]);
    });
  });
});
