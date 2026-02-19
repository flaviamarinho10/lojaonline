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
