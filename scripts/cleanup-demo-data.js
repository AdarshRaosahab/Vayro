const { PrismaClient } = require('@prisma/client')

// Append ?pgbouncer=true to the connection string
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
    console.log('Cleaning up demo data...')

    // Delete reports first (foreign key constraint)
    await prisma.abuseReport.deleteMany({
        where: {
            reason: { in: ['Phishing attempt', 'Malware detected'] }
        }
    })

    // Delete demo links
    await prisma.link.deleteMany({
        where: {
            code: { in: ['free-money', 'virus-download', 'scam-alert'] }
        }
    })

    // Delete spammer user
    await prisma.user.deleteMany({
        where: { email: 'spammer@example.com' }
    })

    console.log('Cleanup complete!')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
