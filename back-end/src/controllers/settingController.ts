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

export const getAppearance = async (req: Request, res: Response) => {
    try {
        const setting = await prisma.storeSetting.findUnique({
            where: { key: 'appearance' }
        });

        const defaultAppearance = {
            topBar: {
                active: true,
                message: 'Frete Grátis para todo o Brasil',
                bgColor: '#66c2bb'
            },
            hero: {
                desktopImage: '/Banner/Banner.png',
                mobileImage: '',
                title: '',
                subtitle: '',
                buttonText: '',
                buttonLink: ''
            },
            storePhoto: {
                active: true,
                url: 'https://placehold.co/200x200/ffe4e6/be185d?text=Logo',
                size: 96 // size in pixels (equivalent to w-24, h-24)
            }
        };

        if (!setting) {
            return res.json(defaultAppearance);
        }

        res.json(JSON.parse(setting.value));
    } catch (error) {
        console.error('Error fetching appearance:', error);
        res.status(500).json({ error: 'Error fetching appearance' });
    }
};

export const updateAppearance = async (req: Request, res: Response) => {
    try {
        const appearanceDisplay = req.body;

        await prisma.storeSetting.upsert({
            where: { key: 'appearance' },
            update: { value: JSON.stringify(appearanceDisplay) },
            create: {
                key: 'appearance',
                value: JSON.stringify(appearanceDisplay)
            }
        });

        res.json(appearanceDisplay);
    } catch (error: any) {
        console.error('Error updating appearance:', error);
        require('fs').appendFileSync(require('path').join(__dirname, '../../debug_error.log'), new Date().toISOString() + ' Error updating appearance: ' + (error?.stack || error?.message || String(error)) + '\n');
        res.status(500).json({ error: 'Error updating appearance', details: error?.message });
    }
};
