import * as ordersController from '@/controllers/orders';
import { Router } from 'express';

const router = Router();

router.post('/', ordersController.addOrder);

router.get('/:userId', ordersController.getUserOrders);

router.get('/', ordersController.getAllOrders);

export default router;
