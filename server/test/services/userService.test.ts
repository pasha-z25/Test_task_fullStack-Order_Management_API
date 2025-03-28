import { User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { UserService } from '@/services/userService';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userRepository: Repository<User>;
  let userService: UserService;

  beforeEach(async () => {
    userRepository = getRepository(User);
    userService = new UserService();
  });

  describe('getAllUsers', () => {
    it('should return a list of users when users exist', async () => {
      const user1 = userRepository.create({
        id: randomUUID(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        balance: 100,
      });
      const user2 = userRepository.create({
        id: randomUUID(),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        balance: 200,
      });
      await userRepository.save([user1, user2]);

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users).toContainEqual(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
        })
      );
      expect(users).toContainEqual(
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        })
      );
    });

    it('should return an empty array when no users exist', async () => {
      const users = await userService.getAllUsers();

      expect(users).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return a user when the user exists', async () => {
      const userId = randomUUID();
      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test.user@example.com',
        balance: 300,
      });
      await userRepository.save(user);

      const result = await userService.getUserById(userId);

      expect(result).not.toBeNull();
      expect(result).toEqual(
        expect.objectContaining({
          id: userId,
          name: 'Test User',
          email: 'test.user@example.com',
          balance: 300,
        })
      );
    });

    it('should return null when the user does not exist', async () => {
      const nonExistentId = randomUUID();
      const result = await userService.getUserById(nonExistentId);

      expect(result).toBeNull();
    });
  });
});
