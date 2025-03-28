import { app } from '@/app';
import { Product, User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('Order API', () => {
  let userRepository: any;
  let productRepository: any;

  beforeEach(async () => {
    userRepository = getRepository(User);
    productRepository = getRepository(Product);
  });

  describe('POST /orders', () => {
    it('should create a new order successfully', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test-user1@example.com',
        balance: 1000,
      });
      await userRepository.save(user);

      const product = productRepository.create({
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
      });
      await productRepository.save(product);

      const response = await request(app).post('/orders').send({
        userId,
        productId,
        quantity: 2,
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.totalPrice).toBe(200);
    });

    it('should return 403 if balance is insufficient', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test-user2@example.com',
        balance: 50,
      });
      await userRepository.save(user);

      const product = productRepository.create({
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
      });
      await productRepository.save(product);

      const response = await request(app).post('/orders').send({
        userId,
        productId,
        quantity: 2,
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        '⚠️  Insufficient balance for user Test User. Required: 200, Available: 50'
      );
    });

    it('should return 403 if stock is insufficient', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test-user3@example.com',
        balance: 1000,
      });
      await userRepository.save(user);

      const product = productRepository.create({
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 1,
      });
      await productRepository.save(product);

      const response = await request(app).post('/orders').send({
        userId,
        productId,
        quantity: 2,
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        '⚠️  Insufficient stock for product Test Product. Available: 1, Requested: 2'
      );
    });
  });

  describe('GET /orders/:userId', () => {
    it('should return orders for a specific user', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test-user4@example.com',
        balance: 1000,
      });
      await userRepository.save(user);

      const product = productRepository.create({
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
      });
      await productRepository.save(product);

      await request(app).post('/orders').send({
        userId,
        productId,
        quantity: 1,
      });

      const response = await request(app).get(`/orders/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].userId).toBe(userId);
    });

    it('should return empty array if no orders exist', async () => {
      const userId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test-user5@example.com',
        balance: 1000,
      });
      await userRepository.save(user);

      const response = await request(app).get(`/orders/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });
  });
});
