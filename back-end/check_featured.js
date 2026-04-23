require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.findMany({ select: { name: true, isFeatured: true, active: true } })
    .then(p => {
        console.log('Products Debug:');
        p.forEach(product => console.log(`- ${product.name}: Featured=${product.isFeatured}, Active=${product.active}`));
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
