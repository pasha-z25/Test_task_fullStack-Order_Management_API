import { Product, User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { OrderService } from '@/services/orderService';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

describe('OrderService Transactions', () => {
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let orderService: OrderService;

  beforeEach(async () => {
    userRepository = getRepository(User);
    productRepository = getRepository(Product);
    orderService = new OrderService();
  });

  it('should rollback transaction if balance is insufficient', async () => {
    const userId = randomUUID();
    const productId = randomUUID();

    const user = userRepository.create({
      id: userId,
      name: 'John',
      email: 'john1@example.com',
      balance: 50,
    });
    await userRepository.save(user);

    const product = productRepository.create({
      id: productId,
      name: 'Laptop',
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

    const updatedUser = await userRepository.findOneBy({ id: userId });
    const updatedProduct = await productRepository.findOneBy({ id: productId });

    expect(updatedUser?.balance).toBe(50);
    expect(updatedProduct?.stock).toBe(10);
  });

  it('should rollback transaction if stock is insufficient', async () => {
    const userId = randomUUID();
    const productId = randomUUID();

    const user = userRepository.create({
      id: userId,
      name: 'John',
      email: 'john2@example.com',
      balance: 1000,
    });
    await userRepository.save(user);

    const product = productRepository.create({
      id: productId,
      name: 'Laptop',
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

    const updatedUser = await userRepository.findOneBy({ id: userId });
    const updatedProduct = await productRepository.findOneBy({ id: productId });

    expect(updatedUser?.balance).toBe(1000);
    expect(updatedProduct?.stock).toBe(1);
  });
});
