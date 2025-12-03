const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const link = await prisma.link.findUnique({
        where: {
            code: '774d264a',
        },
    })
    console.log('Link:', link)
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
