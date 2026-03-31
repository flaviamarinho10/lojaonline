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
exports.updateAppearance = exports.getAppearance = exports.updateBanner = exports.getBanner = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = yield prisma.storeSetting.findUnique({
            where: { key: 'homeBannerUrl' }
        });
        // Return default if not found (fallback)
        const bannerUrl = (setting === null || setting === void 0 ? void 0 : setting.value) || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop";
        res.json({ url: bannerUrl });
    }
    catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({ error: 'Error fetching banner' });
    }
});
exports.getBanner = getBanner;
const updateBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        const setting = yield prisma.storeSetting.upsert({
            where: { key: 'homeBannerUrl' },
            update: { value: url },
            create: {
                key: 'homeBannerUrl',
                value: url
            }
        });
        res.json(setting);
    }
    catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ error: 'Error updating banner' });
    }
});
exports.updateBanner = updateBanner;
const getAppearance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = yield prisma.storeSetting.findUnique({
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
            }
        };
        if (!setting) {
            return res.json(defaultAppearance);
        }
        res.json(JSON.parse(setting.value));
    }
    catch (error) {
        console.error('Error fetching appearance:', error);
        res.status(500).json({ error: 'Error fetching appearance' });
    }
});
exports.getAppearance = getAppearance;
const updateAppearance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appearanceDisplay = req.body;
        yield prisma.storeSetting.upsert({
            where: { key: 'appearance' },
            update: { value: JSON.stringify(appearanceDisplay) },
            create: {
                key: 'appearance',
                value: JSON.stringify(appearanceDisplay)
            }
        });
        res.json(appearanceDisplay);
    }
    catch (error) {
        console.error('Error updating appearance:', error);
        res.status(500).json({ error: 'Error updating appearance' });
    }
});
exports.updateAppearance = updateAppearance;
//# sourceMappingURL=settingController.js.map