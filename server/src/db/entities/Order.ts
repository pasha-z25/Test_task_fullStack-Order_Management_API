import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppDataSource } from '..';
import { Product } from './Product';
import { User } from './User';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer', nullable: false })
  quantity!: number;

  @Column({ type: 'decimal' })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @BeforeInsert()
  async beforeInsertActions() {
    if (!AppDataSource.isInitialized) {
      throw new Error('❌ AppDataSource is not initialized');
    }

    const productRepository = AppDataSource.getRepository(Product);
    const userRepository = AppDataSource.getRepository(User);

    const product = await productRepository.findOneBy({
      id: this.productId,
    });
    if (product) {
      this.totalPrice = this.quantity * product.price;
    } else {
      throw new Error(`⚠️ Product with ID ${this.productId} not found`);
    }

    const user = await userRepository.findOneBy({
      id: this.userId,
    });
    if (user && this.totalPrice) {
      if (user.balance < this.totalPrice) {
        throw new Error(
          `⚠️ Insufficient balance for user ${user.name}. Required: ${this.totalPrice}, Available: ${user.balance}`
        );
      }

      if (product.stock < this.quantity) {
        throw new Error(
          `⚠️ Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${this.quantity}`
        );
      }

      user.balance -= this.totalPrice;
      product.stock -= this.quantity;

      let savedUser = false;
      for (let i = 0; i < 3; i++) {
        try {
          await Promise.race([
            userRepository.save(user),
            new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(new Error('⏱️ User save timed out after 5 seconds')),
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
            productRepository.save(product),
            new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error('⏱️ Product save timed out after 5 seconds')
                  ),
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
    } else {
      throw new Error(
        `⚠️ User with ID ${this.userId} not found or totalPrice not calculated`
      );
    }
  }
}
