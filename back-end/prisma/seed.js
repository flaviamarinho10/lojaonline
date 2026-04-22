const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@shineglam.com' },
        update: {},
        create: {
            email: 'admin@shineglam.com',
            password: hashedPassword,
            name: 'Admin Shine Glam',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created (admin@shineglam.com / admin123)');

    console.log('\n🎉 Seed complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
