require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.count().then(c => console.log('Products:', c)).catch(console.error).finally(() => prisma.$disconnect());
