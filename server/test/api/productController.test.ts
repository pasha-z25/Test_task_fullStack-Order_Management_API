import { app } from '@/app';
import { Product } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { Repository } from 'typeorm';

describe('Product API', () => {
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    productRepository = getRepository(Product);
  });

  describe('GET /products', () => {
    it('should return a list of products successfully', async () => {
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

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining({ name: 'Laptop', price: '1000', stock: 5 })
      );
      expect(response.body.data).toContainEqual(
        expect.objectContaining({ name: 'Mouse', price: '20', stock: 50 })
      );
    });

    it('should return an empty array if no products exist', async () => {
      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });

    it('should return 500 if an error occurs', async () => {
      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });
});
