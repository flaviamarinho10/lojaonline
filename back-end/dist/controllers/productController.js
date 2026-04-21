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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const LOG_FILE = path_1.default.join(__dirname, '../../debug_error.log');
const log = (msg) => {
    try {
        const timestamp = new Date().toISOString();
        fs_1.default.appendFileSync(LOG_FILE, `[${timestamp}] ${msg}\n`);
    }
    catch (e) {
        // ignore log error
    }
    console.log(msg);
};
const parsePrice = (value) => {
    if (value === null || value === undefined || value === '')
        return null;
    if (typeof value === 'number')
        return value;
    const sanitized = value.toString().replace(',', '.');
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? null : parsed;
};
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, featured, sort, search } = req.query;
        const whereClause = { active: true };
        if (category) {
            whereClause.categoryId = String(category);
        }
        if (featured === 'true') {
            whereClause.isFeatured = true;
        }
        let orderBy = [{ createdAt: 'desc' }];
        if (sort === 'manual') {
            orderBy = [{ sortOrder: 'asc' }, { createdAt: 'desc' }];
        }
        let products = yield prisma.product.findMany({
            where: whereClause,
            orderBy
        });
        if (search && String(search).trim() !== '') {
            const searchTerm = String(search).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            products = products.filter(p => {
                const normalizedName = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalizedName.includes(searchTerm);
            });
        }
        res.json(products);
    }
    catch (error) {
        log(`Error fetching products: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error fetching products' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        log(`Error fetching product ${id}: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error fetching product' });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log(`Creating product with body: ${JSON.stringify(req.body)}`);
    try {
        const { name, description, price, comparePrice, imageUrl, colors, badges, categoryId, sortOrder, isFeatured, howToUse, whyLoveIt, composition } = req.body;
        const numericPrice = parsePrice(price);
        if (numericPrice === null) {
            log('Invalid price format error');
            return res.status(400).json({ error: 'Invalid price format' });
        }
        const product = yield prisma.product.create({
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
                howToUse: howToUse || null,
                whyLoveIt: whyLoveIt || null,
                composition: composition || null,
                active: true
            }
        });
        res.status(201).json(product);
    }
    catch (error) {
        log(`Error creating product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error creating product' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    log(`Updating product ${id} with body: ${JSON.stringify(req.body)}`);
    const _a = req.body, { price, comparePrice, categoryId, sortOrder, isFeatured, howToUse, whyLoveIt, composition } = _a, rest = __rest(_a, ["price", "comparePrice", "categoryId", "sortOrder", "isFeatured", "howToUse", "whyLoveIt", "composition"]);
    try {
        const data = Object.assign({}, rest);
        if (howToUse !== undefined)
            data.howToUse = howToUse;
        if (whyLoveIt !== undefined)
            data.whyLoveIt = whyLoveIt;
        if (composition !== undefined)
            data.composition = composition;
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
        const product = yield prisma.product.update({
            where: { id },
            data
        });
        res.json(product);
    }
    catch (error) {
        log(`Error updating product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.product.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        log(`Error deleting product: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map