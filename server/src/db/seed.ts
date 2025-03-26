import { OrderService } from '@/services/orderService';
import { AppDataSource, initializeDataSource } from '.';
import { Order, Product, User } from './entities';

export async function seedDatabase(clearPrevious?: boolean) {
  await initializeDataSource();

  if (!AppDataSource.isInitialized) {
    throw new Error('⚠️ AppDataSource is not initialized');
  }

  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);
  const orderRepository = AppDataSource.getRepository(Order);

  if (clearPrevious) {
    await userRepository.delete({});
    await productRepository.delete({});
    await orderRepository.delete({});
  }

  const userCount = await userRepository.count();
  const productCount = await productRepository.count();
  const orderCount = await orderRepository.count();

  if (userCount > 0 && productCount > 0 && orderCount > 0) {
    console.log('💡 Database already seeded, skipping...');
    await AppDataSource.destroy();
    return;
  } else {
    await userRepository.delete({});
    await productRepository.delete({});
    await orderRepository.delete({});
  }

  const users = [
    { name: 'John Doe', email: 'john.doe@example.com', balance: 150 },
    { name: 'Jane Smith', email: 'jane.smith@example.com', balance: 200 },
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', balance: 100 },
  ];

  const savedUsers = await userRepository.save(users);
  console.log('ℹ️ Users created:', savedUsers);

  const products = [
    { name: 'Laptop', price: 999.99, stock: 10 },
    { name: 'Smartphone', price: 499.99, stock: 20 },
    { name: 'Headphones', price: 79.99, stock: 50 },
    { name: 'Mouse', price: 29.99, stock: 100 },
    { name: 'Keyboard', price: 59.99, stock: 30 },
  ];

  const savedProducts = await productRepository.save(products);
  console.log('ℹ️ Products created:', savedProducts);

  const ordersData = [
    {
      userId: savedUsers[0].id, // John Doe
      productId: savedProducts[0].id, // Laptop
      quantity: 1,
    },
    {
      userId: savedUsers[0].id, // John Doe
      productId: savedProducts[2].id, // Headphones
      quantity: 2,
    },
    {
      userId: savedUsers[1].id, // Jane Smith
      productId: savedProducts[1].id, // Smartphone
      quantity: 1,
    },
    {
      userId: savedUsers[2].id, // Alice Johnson
      productId: savedProducts[3].id, // Mouse
      quantity: 3,
    },
  ];

  const savedOrders = [];
  for (const orderData of ordersData) {
    try {
      const order = await OrderService.createOrder(orderData);
      savedOrders.push(order);
      console.log(`ℹ️ Order created for user ${order.userId}:`, order);
    } catch (error: any) {
      console.warn(
        `⚠️ Failed to create order for user ${orderData.userId}: ${error.message}`
      );
    }
  }

  console.log('ℹ️ Orders created:', savedOrders);

  await AppDataSource.destroy();
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
