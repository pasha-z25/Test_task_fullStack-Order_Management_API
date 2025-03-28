import { app } from '@/app';
import { User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { Repository } from 'typeorm';

describe('User API', () => {
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = getRepository(User);
  });

  describe('GET /users', () => {
    it('should return a list of users successfully', async () => {
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

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
        })
      );
      expect(response.body.data).toContainEqual(
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        })
      );
    });

    it('should return an empty array if no users exist', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user by ID successfully', async () => {
      const userId = randomUUID();
      const user = userRepository.create({
        id: userId,
        name: 'Test User',
        email: 'test.user@example.com',
        balance: 300,
      });
      await userRepository.save(user);

      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(
        expect.objectContaining({
          id: userId,
          name: 'Test User',
          email: 'test.user@example.com',
          balance: 300,
        })
      );
    });

    it('should return null if user does not exist', async () => {
      const nonExistentId = randomUUID();
      const response = await request(app).get(`/users/${nonExistentId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeNull();
    });

    it('should return 500 if an error occurs', async () => {
      const response = await request(app).get('/users/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
});
