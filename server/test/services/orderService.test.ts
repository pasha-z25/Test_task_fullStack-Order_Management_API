import { Product, User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { OrderService } from '@/services/orderService';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let orderService: OrderService;

  beforeEach(async () => {
    userRepository = getRepository(User);
    productRepository = getRepository(Product);
    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should throw an error if user balance is insufficient', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'create-order1@example.com',
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

      await expect(
        orderService.createOrder({
          userId,
          productId,
          quantity: 1,
        })
      ).rejects.toThrow('Insufficient balance');
    });

    it('should throw an error if product stock is insufficient', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'create-order2@example.com',
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

      await expect(
        orderService.createOrder({
          userId,
          productId,
          quantity: 2,
        })
      ).rejects.toThrow('Insufficient stock');
    });

    it('should calculate total price correctly', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'create-order3@example.com',
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
      const order = await orderService.createOrder({
        userId,
        productId,
        quantity: 3,
      });

      expect(order.totalPrice).toBe(300); // 100 * 3
    });

    it('should deduct balance and stock correctly', async () => {
      const userId = randomUUID();
      const productId = randomUUID();

      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'create-order4@example.com',
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

      await orderService.createOrder({
        userId,
        productId,
        quantity: 3,
      });

      const updatedUser = await userRepository.findOneBy({ id: userId });
      const updatedProduct = await productRepository.findOneBy({
        id: productId,
      });

      expect(updatedUser?.balance).toBe(700); // 1000 - (100 * 3)
      expect(updatedProduct?.stock).toBe(7); // 10 - 3
    });
  });
});
