"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingController_1 = require("../controllers/settingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public: Get Settings
router.get('/banner', settingController_1.getBanner); // Legacy
router.get('/appearance', settingController_1.getAppearance);
// Admin: Update Settings
router.put('/banner', authMiddleware_1.authMiddleware, settingController_1.updateBanner); // Legacy
router.put('/appearance', authMiddleware_1.authMiddleware, settingController_1.updateAppearance);
exports.default = router;
//# sourceMappingURL=settingRoutes.js.map