import { AppDataSource } from '@/db';
import { Order, Product, User } from '@/db/entities';

interface OrderData {
  userId: string;
  productId: string;
  quantity: number;
}

export class OrderService {
  static async createOrder(orderData: OrderData): Promise<Order> {
    const { userId, productId, quantity } = orderData;

    const orderRepo = AppDataSource.getRepository(Order);
    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const product = await productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
      );
    }

    const order = new Order();
    order.userId = userId;
    order.productId = productId;
    order.quantity = quantity;
    order.user = user;
    order.product = product;

    return await orderRepo.save(order);
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    const userRepository = AppDataSource.getRepository(User);
    const orderRepository = AppDataSource.getRepository(Order);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    return await orderRepository.find({
      where: { userId },
      relations: ['user', 'product'],
    });
  }

  static async getAllOrders(): Promise<Order[]> {
    const orderRepository = AppDataSource.getRepository(Order);

    return await orderRepository.find({ relations: ['user', 'product'] });
  }
}
