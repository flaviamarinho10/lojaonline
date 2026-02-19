import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { email, items } = req.body; // items: { productId, quantity }[]

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        // Fetch products to get current prices
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        let total = 0;
        const orderItemsData = items.map((item: any) => {
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

        const order = await prisma.order.create({
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
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status: status as OrderStatus }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order status' });
    }
};
