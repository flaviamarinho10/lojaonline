import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:id', authMiddleware, updateOrderStatus);

export default router;
