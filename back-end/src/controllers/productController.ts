import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const LOG_FILE = path.join(__dirname, '../../debug_error.log');

const log = (msg: string) => {
    try {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(LOG_FILE, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        // ignore log error
    }
    console.log(msg);
};

const parsePrice = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return value;
    const sanitized = value.toString().replace(',', '.');
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? null : parsed;
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, featured, sort } = req.query;
        const whereClause: any = { active: true };
        
        if (category) {
            whereClause.categoryId = String(category);
        }

        if (featured === 'true') {
            whereClause.isFeatured = true;
        }

        let orderBy: any = [{ createdAt: 'desc' }];
        if (sort === 'manual') {
            orderBy = [{ sortOrder: 'asc' }, { createdAt: 'desc' }];
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy
        });
        res.json(products);
    } catch (error: any) {
        log(`Error fetching products: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error: any) {
        log(`Error fetching product ${id}: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error fetching product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    log(`Creating product with body: ${JSON.stringify(req.body)}`);
    try {
        const { name, description, price, comparePrice, imageUrl, colors, badges, categoryId, sortOrder, isFeatured } = req.body;

        const numericPrice = parsePrice(price);
        if (numericPrice === null) {
            log('Invalid price format error');
            return res.status(400).json({ error: 'Invalid price format' });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: numericPrice,
                comparePrice: parsePrice(comparePrice),
                imageUrl: imageUrl || 'https://placehold.co/400',
                colors: colors || [],
                badges: badges || [],
                categoryId: categoryId || null,
                sortOrder: sortOrder ? parseInt(String(sortOrder)) : 0,
                isFeatured: isFeatured === true || isFeatured === 'true',
                active: true
            }
        });
        res.status(201).json(product);
    } catch (error: any) {
        log(`Error creating product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error creating product' });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    log(`Updating product ${id} with body: ${JSON.stringify(req.body)}`);
    const { price, comparePrice, categoryId, sortOrder, isFeatured, ...rest } = req.body;
    try {
        const data: any = { ...rest };

        if (price !== undefined) {
            const numericPrice = parsePrice(price);
            if (numericPrice !== null) {
                data.price = numericPrice;
            }
        }

        if (comparePrice !== undefined) {
            data.comparePrice = parsePrice(comparePrice);
        }

        if (categoryId !== undefined) {
            data.categoryId = categoryId;
        }
        
        if (sortOrder !== undefined) {
            data.sortOrder = parseInt(String(sortOrder));
        }

        if (isFeatured !== undefined) {
            data.isFeatured = isFeatured === true || isFeatured === 'true';
        }

        const product = await prisma.product.update({
            where: { id },
            data
        });
        res.json(product);
    } catch (error: any) {
        log(`Error updating product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error updating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error: any) {
        log(`Error deleting product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error deleting product' });
    }
};
