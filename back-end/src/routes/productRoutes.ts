import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
