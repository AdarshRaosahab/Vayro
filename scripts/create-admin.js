const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'adarshyadav8368@gmail.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { role: 'ADMIN' },
            create: {
                email,
                password: hashedPassword,
                displayName: 'Adarsh Yadav',
                role: 'ADMIN',
                plan: 'free',
                onboardCompleted: true
            }
        })
        console.log(`User ${user.email} created/updated as ADMIN.`)
    } catch (error) {
        console.error('Failed to create user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
