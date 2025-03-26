import * as ordersController from '@/controllers/orders';
import { rateLimiter } from '@/middleware/rateLimit';
import { Router } from 'express';

const router = Router();

router.post('/', rateLimiter, ordersController.addOrder);

router.get('/:userId', rateLimiter, ordersController.getUserOrders);

router.get('/', rateLimiter, ordersController.getAllOrders);

export default router;
