import * as ordersController from '@/controllers/orders';
import { rateLimiter } from '@/middleware/rateLimit';
import { Router } from 'express';

const router = Router();

router.post('/', rateLimiter, ordersController.addOrder);

router.get('/:userId', rateLimiter, ordersController.getOrders);

router.get('/', rateLimiter, ordersController.getOrders);

export default router;
