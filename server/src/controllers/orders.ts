import { OrderService } from '@/services/orderService';
import logger from '@/utils/logger';
import type { NextFunction, Request, Response } from 'express';

export const addOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, productId, quantity } = req.body;

  logger.info('POST /orders', { userId, productId, quantity });

  if (!userId || !productId || !quantity || quantity <= 0) {
    logger.warn('Invalid request data', { userId, productId, quantity });
    res.status(400).json({
      status: 'error',
      message:
        'Invalid request data. userId, productId, and quantity (positive integer) are required.',
    });
    return;
  }

  try {
    const orderService = new OrderService();

    const order = await orderService.createOrder({
      userId,
      productId,
      quantity,
    });

    logger.info('Order created successfully', {
      orderId: order.id,
      userId,
      productId,
    });

    res.status(201).json({
      status: 'success',
      data: order,
    });
  } catch (error: any) {
    logger.error('❌ Error creating order', {
      error: error.message,
      userId,
      productId,
    });

    if (error.message.includes('User not found')) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }
    if (error.message.includes('Product not found')) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
      return;
    }
    if (error.message.includes('Insufficient stock')) {
      res.status(403).json({ status: 'error', message: error.message });
      return;
    }
    if (error.message.includes('Insufficient balance')) {
      res.status(403).json({ status: 'error', message: error.message });
      return;
    }
    next(error);
  }
};

export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  logger.info('GET /orders/:userId', { userId });

  try {
    const orderService = new OrderService();

    const orders = await orderService.getOrdersByUserId(userId);

    logger.info('Orders retrieved successfully', {
      userId,
      orderCount: orders.length,
    });

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error: any) {
    logger.error('❌ Error retrieving orders', {
      error: error.message,
      userId,
    });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};

export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  logger.info('GET /orders');

  try {
    const orderService = new OrderService();

    const orders = await orderService.getAllOrders();

    logger.info('Orders retrieved successfully', {
      orderCount: orders.length,
    });

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error: any) {
    logger.error('❌ Error retrieving orders', { error: error.message });
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};
