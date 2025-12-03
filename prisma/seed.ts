import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean up existing data
    await prisma.clickEvent.deleteMany()
    await prisma.link.deleteMany()
    await prisma.user.deleteMany()

    // Create Users
    const userFree = await prisma.user.create({
        data: {
            email: 'user@vayro.test',
            password: 'hashedpassword123',
            plan: 'free',
        },
    })

    const userPremium = await prisma.user.create({
        data: {
            email: 'pro@vayro.test',
            password: 'hashedpassword123',
            plan: 'premium',
        },
    })

    // Create Links
    const linksData = [
        { code: 'launch', target: 'https://vayro.io/launch', userId: userFree.id },
        { code: 'demo', target: 'https://vayro.io/demo', userId: userFree.id },
        { code: 'blog', target: 'https://vayro.io/blog', userId: userFree.id },
        { code: 'offer', target: 'https://vayro.io/offer', userId: userPremium.id },
        { code: 'vip', target: 'https://vayro.io/vip', userId: userPremium.id },
        { code: 'secret', target: 'https://vayro.io/secret', userId: userPremium.id },
    ]

    const links = []
    for (const link of linksData) {
        const createdLink = await prisma.link.create({
            data: {
                code: link.code,
                target: link.target,
                userId: link.userId,
            },
        })
        links.push(createdLink)
    }

    // Create Click Events
    const countries = ['IN', 'US', 'GB', 'CA']
    const devices = ['mobile', 'desktop', 'tablet']
    const browsers = ['Chrome', 'Safari', 'Firefox']

    for (let i = 0; i < 30; i++) {
        const randomLink = links[Math.floor(Math.random() * links.length)]
        const randomDate = new Date()
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))

        await prisma.clickEvent.create({
            data: {
                linkId: randomLink.id,
                country: countries[Math.floor(Math.random() * countries.length)],
                device: devices[Math.floor(Math.random() * devices.length)],
                browser: browsers[Math.floor(Math.random() * browsers.length)],
                createdAt: randomDate,
            },
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
