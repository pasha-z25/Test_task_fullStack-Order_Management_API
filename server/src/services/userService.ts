import { AppDataSource } from '@/db';
import { User } from '@/db/entities';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);

    return await userRepository.find();
  }

  static async getUserById(userId: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);

    return await userRepository.findOne({
      where: { id: userId },
    });
  }
}
