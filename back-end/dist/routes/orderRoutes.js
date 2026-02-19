"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', orderController_1.createOrder);
router.get('/', authMiddleware_1.authMiddleware, orderController_1.getOrders);
router.put('/:id', authMiddleware_1.authMiddleware, orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map