const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@loja.com'
    const password = await bcrypt.hash('loja1234', 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: 'Admin Loja',
            role: 'ADMIN'
        },
        create: {
            email: adminEmail,
            password: password,
            name: 'Admin Loja',
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Seed Default Banner
    const banner = await prisma.storeSetting.upsert({
        where: { key: 'homeBannerUrl' },
        update: {},
        create: {
            key: 'homeBannerUrl',
            value: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop'
        }
    })
    console.log({ banner })

    // Seed Default Categories
    const defaultCategories = [
        { name: 'Pele', bgColor: 'bg-green-100', sortOrder: 1 },
        { name: 'Olhos', bgColor: 'bg-pink-100', sortOrder: 2 },
        { name: 'Lábios', bgColor: 'bg-rose-200', sortOrder: 3 },
        { name: 'Sobrancelhas', bgColor: 'bg-teal-100', sortOrder: 4 },
        { name: 'Corporal', bgColor: 'bg-pink-200', sortOrder: 5 },
        { name: 'Kits', bgColor: 'bg-amber-100', sortOrder: 6 },
        { name: 'Acessórios', bgColor: 'bg-blue-100', sortOrder: 7 },
        { name: 'Cabelos', bgColor: 'bg-purple-100', sortOrder: 8 },
    ]

    for (const cat of defaultCategories) {
        const existing = await prisma.category.findFirst({ where: { name: cat.name } })
        if (!existing) {
            const created = await prisma.category.create({ data: cat })
            console.log('Created category:', created.name)
        } else {
            console.log('Category already exists:', existing.name)
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
