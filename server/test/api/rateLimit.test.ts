import { app } from '@/app';
import { User } from '@/db/entities';
import { getRepository } from '@/db/repository';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { Repository } from 'typeorm';

describe('Rate Limiting', () => {
  let userRepository: Repository<User>;
  let userId = randomUUID();

  beforeEach(async () => {
    userRepository = getRepository(User);

    const user = userRepository.create({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      balance: 1000,
    });
    await userRepository.save(user);
  });

  it('should allow requests under the limit', async () => {
    for (let i = 0; i < 10; i++) {
      const response = await request(app).get(`/orders/${userId}`);
      expect(response.status).toBe(200);
    }
  });

  it('should return 429 after exceeding the limit', async () => {
    for (let i = 0; i < 15; i++) {
      await request(app).get(`/orders/${userId}`);
    }

    const response = await request(app).get(`/orders/${userId}`);
    expect(response.status).toBe(429);
    expect(response.body.message).toBe(
      'Too many requests, please try again later.'
    );
  });
});
