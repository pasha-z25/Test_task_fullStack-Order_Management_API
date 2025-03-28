import { Order, Product, User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { Repository } from 'typeorm';

interface OrderData {
  userId: string;
  productId: string;
  quantity: number;
}

export class OrderService {
  private orderRepository: Repository<Order> = getRepository(Order);
  private userRepository: Repository<User> = getRepository(User);
  private productRepository: Repository<Product> = getRepository(Product);

  async createOrder(orderData: OrderData): Promise<Order> {
    const { userId, productId, quantity } = orderData;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`⚠️  User with ID ${userId} not found`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error(`⚠️  Product with ID ${productId} not found`);
    }

    const totalPrice = quantity * product.price;

    if (user.balance < totalPrice) {
      throw new Error(
        `⚠️ Insufficient balance for user ${user.name}. Required: ${totalPrice}, Available: ${user.balance}`
      );
    }

    if (product.stock < quantity) {
      throw new Error(
        `⚠️  Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
      );
    }

    user.balance -= totalPrice;
    product.stock -= quantity;

    let savedUser = false;
    for (let i = 0; i < 3; i++) {
      try {
        await Promise.race([
          this.userRepository.save(user),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('⏱️ User save timed out after 5 seconds')),
              5000
            )
          ),
        ]);
        savedUser = true;
        break;
      } catch (error: any) {
        console.error(
          `🔄 Attempt ${i + 1}/3 to save user failed:`,
          error.message
        );
        if (i === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    if (!savedUser) {
      throw new Error('⚠️ Failed to save user after 3 attempts');
    }

    let savedProduct = false;
    for (let i = 0; i < 3; i++) {
      try {
        await Promise.race([
          this.productRepository.save(product),
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(new Error('⏱️ Product save timed out after 5 seconds')),
              5000
            )
          ),
        ]);
        savedProduct = true;
        break;
      } catch (error: any) {
        console.error(
          `🔄 Attempt ${i + 1}/3 to save product failed:`,
          error.message
        );
        if (i === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    if (!savedProduct) {
      throw new Error('⚠️ Failed to save product after 3 attempts');
    }

    const order = this.orderRepository.create({
      userId,
      productId,
      quantity,
      totalPrice,
    });

    return await this.orderRepository.save(order);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('⚠️  User not found');
    }

    return await this.orderRepository.find({
      where: { userId },
      relations: ['user', 'product'],
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'product'] });
  }
}
