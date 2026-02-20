import { Router } from 'express';
import { getBanner, updateBanner, getAppearance, updateAppearance } from '../controllers/settingController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public: Get Settings
router.get('/banner', getBanner); // Legacy
router.get('/appearance', getAppearance);

// Admin: Update Settings
router.put('/banner', authMiddleware, updateBanner); // Legacy
router.put('/appearance', authMiddleware, updateAppearance);

export default router;
