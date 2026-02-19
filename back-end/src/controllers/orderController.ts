import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { email, items } = req.body; // items: { productId, quantity }[]

        // Calculate total and formatted items would go here
        // For now simplistic implementation

        // We need to fetch products to get prices
        // This is a simplified version

        // const order = await prisma.order.create({ ... });

        res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Error creating order' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order status' });
    }
};
