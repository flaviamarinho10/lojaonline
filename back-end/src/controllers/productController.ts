import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: { active: true }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl, colors } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                imageUrl,
                colors: colors || [],
                active: true
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { price, ...rest } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...rest,
                ...(price && { price: Number(price) })
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};
