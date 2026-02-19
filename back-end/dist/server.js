"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/auth', authRoutes_1.default);
app.use('/products', productRoutes_1.default);
app.use('/orders', orderRoutes_1.default);
// Health check
app.get('/', (req, res) => {
    res.send('API is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map