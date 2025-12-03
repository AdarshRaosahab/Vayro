const { PrismaClient } = require('@prisma/client')

// Append ?pgbouncer=true to the connection string to avoid prepared statement errors with Supabase Transaction Pooler
const connectionString = process.env.DATABASE_URL.includes('?')
    ? `${process.env.DATABASE_URL}&pgbouncer=true`
    : `${process.env.DATABASE_URL}?pgbouncer=true`

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
})

async function main() {
    console.log('Seeding abuse reports...')

    // 1. Get or Create a "Bad Actor" user
    let badUser = await prisma.user.findUnique({ where: { email: 'spammer@example.com' } })
    if (!badUser) {
        badUser = await prisma.user.create({
            data: {
                email: 'spammer@example.com',
                password: 'password123',
                plan: 'free'
            }
        })
    }

    // 2. Create some bad links
    const badLinksData = [
        { code: 'free-money', target: 'http://phishing-site.com/login', status: 'ACTIVE' },
        { code: 'virus-download', target: 'http://malware.com/exe', status: 'BANNED' }, // Already banned
        { code: 'scam-alert', target: 'http://scam.com/win', status: 'ACTIVE' }
    ]

    for (const linkData of badLinksData) {
        let link = await prisma.link.findUnique({ where: { code: linkData.code } })

        if (!link) {
            link = await prisma.link.create({
                data: {
                    code: linkData.code,
                    target: linkData.target,
                    userId: badUser.id,
                    status: linkData.status,
                    reports: linkData.status === 'BANNED' ? 5 : 1
                }
            })
        }

        // 3. Create Reports for these links
        await prisma.abuseReport.create({
            data: {
                linkId: link.id,
                reason: 'Phishing attempt',
                ip: '192.168.1.1'
            }
        })

        if (linkData.status === 'BANNED') {
            await prisma.abuseReport.create({
                data: {
                    linkId: link.id,
                    reason: 'Malware detected',
                    ip: '192.168.1.2'
                }
            })
        }
    }

    console.log('Seeding complete! Check the Admin Panel.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
