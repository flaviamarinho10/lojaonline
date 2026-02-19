import { Router } from 'express';
import { getBanner, updateBanner } from '../controllers/settingController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public: Get Banner
router.get('/banner', getBanner);

// Admin: Update Banner
router.put('/banner', authMiddleware, updateBanner);

export default router;
