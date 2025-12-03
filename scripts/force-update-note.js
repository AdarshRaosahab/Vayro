const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const updated = await prisma.link.update({
        where: {
            code: '774d264a',
        },
        data: {
            note: 'Test Note from Script',
        },
    })
    console.log('Updated Link:', updated)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
