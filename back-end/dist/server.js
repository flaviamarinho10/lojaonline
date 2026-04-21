"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ limit: '20mb', extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/auth', authRoutes_1.default);
app.use('/products', productRoutes_1.default);
app.use('/orders', orderRoutes_1.default);
app.use('/settings', settingRoutes_1.default);
app.use('/categories', categoryRoutes_1.default);
app.use('/upload', uploadRoutes_1.default);
// Health check
app.get('/', (req, res) => {
    res.send('API is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map