const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ── Admin User ──
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

    // ── Categories ──
    const categoriesData = [
        { name: 'Maquiagem', bgColor: 'bg-pink-100', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop', sortOrder: 1 },
        { name: 'Base', bgColor: 'bg-amber-100', imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop', sortOrder: 2 },
        { name: 'Hidratante', bgColor: 'bg-green-100', imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee7713?w=300&h=300&fit=crop', sortOrder: 3 },
        { name: 'Lábios', bgColor: 'bg-rose-200', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop', sortOrder: 4 },
        { name: 'Olhos', bgColor: 'bg-purple-100', imageUrl: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=300&h=300&fit=crop', sortOrder: 5 },
        { name: 'Pele', bgColor: 'bg-teal-100', imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop', sortOrder: 6 },
    ];

    for (const cat of categoriesData) {
        await prisma.category.create({ data: cat });
    }
    console.log(`✅ ${categoriesData.length} categories created`);

    // ── Products ──
    const productsData = [
        {
            name: 'Base Líquida Matte',
            description: 'Alta cobertura com acabamento matte natural. Longa duração de até 24h.',
            price: 89.90,
            comparePrice: 119.90,
            imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=500&fit=crop',
            colors: [
                { name: 'Bege Claro', hex: '#f5deb3' },
                { name: 'Bege Médio', hex: '#d4a574' },
                { name: 'Bege Escuro', hex: '#a0785a' },
            ],
            badges: ['Frete Grátis'],
        },
        {
            name: 'Corretivo Líquido',
            description: 'Disfarça olheiras e imperfeições com alta cobertura e textura leve.',
            price: 49.90,
            imageUrl: 'https://images.unsplash.com/photo-1599733589046-10c7024bfd68?w=400&h=500&fit=crop',
            colors: [
                { name: 'Porcelana', hex: '#faebd7' },
                { name: 'Natural', hex: '#deb887' },
            ],
            badges: [],
        },
        {
            name: 'Paleta de Sombras Nude',
            description: 'Cores neutras para maquiagem do dia a dia. 12 tons versáteis.',
            price: 79.90,
            imageUrl: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=500&fit=crop',
            badges: ['Lançamento'],
        },
        {
            name: 'Batom Matte Veludo',
            description: 'Textura aveludada com pigmentação intensa. Não resseca os lábios.',
            price: 39.90,
            comparePrice: 54.90,
            imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=500&fit=crop',
            colors: [
                { name: 'Vermelho Clássico', hex: '#c41e3a' },
                { name: 'Rosa Nude', hex: '#d4a89a' },
                { name: 'Vinho', hex: '#722f37' },
                { name: 'Terracota', hex: '#cc7a5a' },
            ],
            badges: ['Frete Grátis'],
        },
        {
            name: 'Máscara de Cílios Volume',
            description: 'Cílios volumosos e alongados sem grumos. Fórmula à prova d\'água.',
            price: 59.90,
            imageUrl: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=400&h=500&fit=crop',
            badges: [],
        },
        {
            name: 'Pó Compacto Translúcido',
            description: 'Fixa a maquiagem e controla a oleosidade o dia todo.',
            price: 54.90,
            imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
            badges: [],
        },
        {
            name: 'Primer Hidratante',
            description: 'Prepara a pele para a maquiagem com hidratação e luminosidade.',
            price: 69.90,
            comparePrice: 89.90,
            imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee7713?w=400&h=500&fit=crop',
            badges: ['Lançamento', 'Frete Grátis'],
        },
        {
            name: 'Blush Cremoso',
            description: 'Cor natural e duradoura com textura cremosa e fácil aplicação.',
            price: 44.90,
            imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop',
            colors: [
                { name: 'Pêssego', hex: '#ffb07c' },
                { name: 'Rosé', hex: '#e8a0bf' },
            ],
            badges: [],
        },
    ];

    for (const product of productsData) {
        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                comparePrice: product.comparePrice || null,
                imageUrl: product.imageUrl,
                colors: product.colors || [],
                badges: product.badges || [],
                active: true,
            },
        });
    }
    console.log(`✅ ${productsData.length} products created`);

    // ── Store Settings ──
    const settings = [
        { key: 'appearance', value: JSON.stringify({
            hero: {
                desktopImage: '',
                mobileImage: '',
                title: '',
                subtitle: '',
                buttonText: '',
                buttonLink: '',
            },
        })},
    ];

    for (const setting of settings) {
        await prisma.storeSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: setting,
        });
    }
    console.log('✅ Store settings created');

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
