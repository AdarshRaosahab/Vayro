const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'adarshyadav8368@gmail.com'
    const newPassword = 'Adarsh@152199'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log(`Password updated for user ${user.email}`)
    } catch (error) {
        console.error('Failed to update password:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
