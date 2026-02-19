import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, imageUrl, bgColor, sortOrder } = req.body;
        const category = await prisma.category.create({
            data: {
                name,
                imageUrl: imageUrl || '',
                bgColor: bgColor || 'bg-green-100',
                sortOrder: sortOrder ? Number(sortOrder) : 0,
            },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { name, imageUrl, bgColor, sortOrder } = req.body;
    try {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                imageUrl: imageUrl ?? '',
                bgColor: bgColor ?? 'bg-green-100',
                sortOrder: sortOrder ? Number(sortOrder) : 0,
            },
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar categoria.' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir categoria.' });
    }
};
