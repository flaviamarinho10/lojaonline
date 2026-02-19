import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBanner = async (req: Request, res: Response) => {
    try {
        const setting = await prisma.storeSetting.findUnique({
            where: { key: 'homeBannerUrl' }
        });

        // Return default if not found (fallback)
        const bannerUrl = setting?.value || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop";

        res.json({ url: bannerUrl });
    } catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({ error: 'Error fetching banner' });
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const setting = await prisma.storeSetting.upsert({
            where: { key: 'homeBannerUrl' },
            update: { value: url },
            create: {
                key: 'homeBannerUrl',
                value: url
            }
        });

        res.json(setting);
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ error: 'Error updating banner' });
    }
};
