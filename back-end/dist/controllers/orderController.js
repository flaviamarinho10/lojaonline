"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, items } = req.body; // items: { productId, quantity }[]
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }
        // Fetch products to get current prices
        const productIds = items.map((item) => item.productId);
        const products = yield prisma.product.findMany({
            where: { id: { in: productIds } }
        });
        let total = 0;
        const orderItemsData = items.map((item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price // Snapshot price at time of order
            };
        });
        const order = yield prisma.order.create({
            data: {
                customerEmail: email,
                total: total,
                status: 'PENDING',
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: true
            }
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});
exports.getOrders = getOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = yield prisma.order.update({
            where: { id },
            data: { status: status }
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating order status' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map