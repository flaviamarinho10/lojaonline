import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import settingRoutes from './routes/settingRoutes';
import categoryRoutes from './routes/categoryRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
const allowedOrigins = [
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL.replace(/\/$/, '')]
        : []),
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origem não permitida: ${origin}`));
        }
    },
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/settings', settingRoutes);
app.use('/categories', categoryRoutes);
app.use('/upload', uploadRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
